"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage } from "@/hooks/use-language";
import { useLenis } from "@/hooks/use-lenis";
import { siteConfig } from "@/data/config";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { AnimatedTerminalIcon } from "@/components/ui/animated-terminal-icon";
import {
  QUICK_COMMANDS,
  TERMINAL_IDENTITY,
  executeTerminalCommand,
  getTerminalCompletion,
  type TerminalEntry,
  type TerminalOutput,
  type ThemeTarget,
} from "@/components/sections/terminal-engine";

const SOUND_STORAGE_KEY = "portfolio-terminal-muted";

type SoundKind = "type" | "action" | "error";

function useTerminalAudio() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY) === "true";
      mutedRef.current = saved;
      setMuted(saved);
    });

    return () => {
      cancelled = true;
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  const ensureContext = useCallback(() => {
    if (mutedRef.current || typeof window === "undefined") return null;

    if (!contextRef.current) {
      const AudioContextConstructor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextConstructor) return null;
      contextRef.current = new AudioContextConstructor();
    }

    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume();
    }

    return contextRef.current;
  }, []);

  const play = useCallback(
    (kind: SoundKind) => {
      if (mutedRef.current) return;
      const context = ensureContext();
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const duration = kind === "type" ? 0.025 : 0.075;

      oscillator.type = kind === "error" ? "sawtooth" : kind === "type" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(
        kind === "error" ? 165 : kind === "type" ? 540 + Math.random() * 180 : 760,
        now,
      );
      gain.gain.setValueAtTime(kind === "type" ? 0.044 : 0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [ensureContext],
  );

  const unlock = useCallback(() => {
    ensureContext();
  }, [ensureContext]);

  const toggle = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(nextMuted));

    if (!nextMuted) {
      ensureContext();
      window.setTimeout(() => play("action"), 0);
    }
  }, [ensureContext, play]);

  return { muted, play, toggle, unlock };
}

function Prompt() {
  return (
    <span className="shrink-0 font-semibold text-slate-700 dark:text-slate-200">
      <span className="text-teal-600 dark:text-teal-300">
        {TERMINAL_IDENTITY.username}@{TERMINAL_IDENTITY.host}
      </span>
      <span>:{TERMINAL_IDENTITY.cwd}$</span>
    </span>
  );
}

function TerminalOutputView({ output }: { output: TerminalOutput }) {
  const { lang } = useLanguage();

  if (output.type === "help") {
    const commands = [
      ["help", lang({ en: "show this command guide", vi: "hiển thị hướng dẫn lệnh" })],
      ["ls", lang({ en: "list virtual portfolio files", vi: "liệt kê tệp portfolio ảo" })],
      ["cat about.txt | about", lang({ en: "read the short profile", vi: "đọc phần giới thiệu ngắn" })],
      ["skills | projects | contact", lang({ en: "print portfolio information", vi: "in thông tin portfolio" })],
      ["theme [light|dark|system]", lang({ en: "change the website theme", vi: "đổi giao diện website" })],
      ["open <section>", lang({ en: "navigate to a portfolio section", vi: "đi tới một phần của portfolio" })],
      ["clear", lang({ en: "clear the terminal", vi: "xóa nội dung terminal" })],
    ];

    return (
      <div className="space-y-1">
        <div className="font-semibold text-teal-700 dark:text-teal-300">
          {lang({ en: "Available commands", vi: "Các lệnh hiện có" })}
        </div>
        {commands.map(([command, description]) => (
          <div key={command} className="grid gap-0 sm:grid-cols-[13rem_1fr] sm:gap-3">
            <span className="text-cyan-700 dark:text-cyan-300">{command}</span>
            <span className="text-slate-500 dark:text-slate-400">{description}</span>
          </div>
        ))}
        <div className="pt-1 text-slate-500 dark:text-slate-400">
          {lang({
            en: "Keys: Tab autocomplete · ↑/↓ history · Ctrl+L clear · Esc cancel",
            vi: "Phím: Tab tự hoàn thành · ↑/↓ lịch sử · Ctrl+L xóa · Esc hủy",
          })}
        </div>
      </div>
    );
  }

  if (output.type === "list") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
        <span className="text-slate-700 dark:text-slate-200">about.txt</span>
        <span className="text-cyan-700 dark:text-cyan-300">skills/</span>
        <span className="text-cyan-700 dark:text-cyan-300">projects/</span>
        <span className="text-slate-700 dark:text-slate-200">contact.txt</span>
      </div>
    );
  }

  if (output.type === "about") {
    return <p className="max-w-3xl leading-relaxed">{lang(siteConfig.description)}</p>;
  }

  if (output.type === "skills") {
    return (
      <div className="space-y-2">
        {skills.map((group) => (
          <div key={group.category.en}>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {lang(group.category)}:
            </span>{" "}
            <span>{group.items.join(" · ")}</span>
          </div>
        ))}
      </div>
    );
  }

  if (output.type === "projects") {
    return (
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div key={project.id}>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {String(index + 1).padStart(2, "0")}. {lang(project.title)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {" "}— {project.techStack.join(" / ")}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (output.type === "contact") {
    return (
      <div className="space-y-1">
        <div>
          <span className="text-slate-500 dark:text-slate-400">email: </span>
          <a className="text-teal-700 underline-offset-4 hover:underline dark:text-teal-300" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">github: </span>
          <a className="text-teal-700 underline-offset-4 hover:underline dark:text-teal-300" href={siteConfig.github} target="_blank" rel="noreferrer">
            {siteConfig.github.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>
    );
  }

  if (output.type === "theme") {
    const targetLabel = output.target === "system"
      ? lang({ en: "system", vi: "hệ thống" })
      : output.target;
    return (
      <p className="text-emerald-700 dark:text-emerald-300">
        {lang({ en: `Theme changed to ${targetLabel}.`, vi: `Đã chuyển giao diện sang ${targetLabel}.` })}
      </p>
    );
  }

  if (output.type === "open") {
    return (
      <p className="text-emerald-700 dark:text-emerald-300">
        {lang({ en: `Opening #${output.target}…`, vi: `Đang mở #${output.target}…` })}
      </p>
    );
  }

  if (output.type === "usage") {
    const usage = {
      cat: "cat about.txt",
      theme: "theme [light|dark|system]",
      open: "open <about|skills|projects|blog|contact>",
    }[output.command];

    return <p className="text-amber-700 dark:text-amber-300">usage: {usage}</p>;
  }

  return (
    <p className="text-rose-700 dark:text-rose-300">
      {output.command}: {lang({ en: "command not found. Type 'help'.", vi: "không tìm thấy lệnh. Gõ 'help'." })}
    </p>
  );
}

export function PortfolioTerminal() {
  const { lang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const { muted, play, toggle, unlock } = useTerminalAudio();
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [typing, setTyping] = useState<{ command: string; index: number } | null>(null);
  const entryIdRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const appendEntries = useCallback((command: string, output?: TerminalOutput) => {
    const nextEntries: TerminalEntry[] = [
      { id: entryIdRef.current++, type: "command", command },
    ];

    if (output) {
      nextEntries.push({ id: entryIdRef.current++, type: "output", output });
    }

    setEntries((current) => [...current, ...nextEntries]);
  }, []);

  const navigateToSection = useCallback(
    (target: string) => {
      const element = document.getElementById(target);
      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element, { duration: 1.2, offset: 0 });
      } else {
        element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }

      window.history.pushState(null, "", `#${target}`);
    },
    [lenis, reduceMotion],
  );

  const runCommand = useCallback(
    (rawCommand: string) => {
      const command = rawCommand.trim();
      if (!command) return;

      const result = executeTerminalCommand(command);
      setInput("");
      setHistoryIndex(null);
      setHistory((current) => [...current, command]);

      if (result.action?.type === "clear") {
        setEntries([]);
        play("action");
        return;
      }

      let output = result.output;

      if (result.action?.type === "theme") {
        const target: ThemeTarget = result.action.target === "toggle"
          ? resolvedTheme === "dark" ? "light" : "dark"
          : result.action.target;
        setTheme(target);
        output = { type: "theme", target };
      }

      if (result.action?.type === "open") {
        navigateToSection(result.action.target);
      }

      appendEntries(command, output);
      play(output?.type === "unknown" || output?.type === "usage" ? "error" : "action");
    },
    [appendEntries, navigateToSection, play, resolvedTheme, setTheme],
  );

  useEffect(() => {
    if (!typing) return;

    if (typing.index >= typing.command.length) {
      const completionTimer = window.setTimeout(() => {
        const command = typing.command;
        setTyping(null);
        runCommand(command);
      }, 180);

      return () => window.clearTimeout(completionTimer);
    }

    const typingTimer = window.setTimeout(() => {
      const nextIndex = typing.index + 1;
      setInput(typing.command.slice(0, nextIndex));
      play("type");
      setTyping({ ...typing, index: nextIndex });
    }, 48 + Math.round(Math.random() * 34));

    return () => window.clearTimeout(typingTimer);
  }, [play, runCommand, typing]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }, [entries, input, typing]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const containWheel = (event: globalThis.WheelEvent) => {
      const output = scrollRef.current;
      if (!output) return;

      const maxScrollTop = output.scrollHeight - output.clientHeight;
      if (maxScrollTop <= 1) return;

      const deltaMultiplier = event.deltaMode === 1
        ? 100 / 6
        : event.deltaMode === 2
          ? output.clientHeight
          : 1;
      const pixelDelta = event.deltaY * deltaMultiplier;
      if (pixelDelta === 0) return;

      const isScrollingDown = pixelDelta > 0;
      const availableDistance = isScrollingDown
        ? Math.max(0, maxScrollTop - output.scrollTop)
        : Math.max(0, output.scrollTop);
      const terminalDelta = Math.sign(pixelDelta) * Math.min(
        Math.abs(pixelDelta),
        availableDistance,
      );
      const pageDelta = pixelDelta - terminalDelta;

      event.preventDefault();
      event.stopPropagation();

      if (terminalDelta !== 0) {
        output.scrollTop = Math.max(
          0,
          Math.min(maxScrollTop, output.scrollTop + terminalDelta),
        );
      }

      if (pageDelta === 0) return;

      if (lenis) {
        window.dispatchEvent(
          new globalThis.WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            deltaX: event.deltaX,
            deltaY: pageDelta,
            deltaMode: 0,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
          }),
        );
      } else {
        window.scrollBy({ top: pageDelta, behavior: "auto" });
      }
    };

    terminal.addEventListener("wheel", containWheel, { passive: false });
    return () => terminal.removeEventListener("wheel", containWheel);
  }, [lenis]);

  const completion = useMemo(
    () => typing?.command ?? getTerminalCompletion(input),
    [input, typing],
  );
  const completionRemainder = completion?.startsWith(input)
    ? completion.slice(input.length)
    : "";

  const completeAndRunTyping = useCallback(() => {
    if (!typing) return;
    const command = typing.command;
    setTyping(null);
    setInput(command);
    window.setTimeout(() => runCommand(command), 0);
  }, [runCommand, typing]);

  const handleQuickCommand = (command: string) => {
    unlock();
    inputRef.current?.focus();

    if (reduceMotion) {
      runCommand(command);
      return;
    }

    setHistoryIndex(null);
    setInput("");
    setTyping({ command, index: 0 });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    unlock();

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setTyping(null);
      setInput("");
      setEntries([]);
      play("action");
      return;
    }

    if (typing) {
      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        completeAndRunTyping();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setTyping(null);
        setInput("");
        return;
      }

      if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
        setTyping(null);
      } else {
        return;
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(input);
      return;
    }

    if (event.key === "Tab" && completion) {
      event.preventDefault();
      setInput(completion);
      play("type");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null
        ? history.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
      return;
    }

    if (event.key === "Escape") {
      setInput("");
      setHistoryIndex(null);
      return;
    }

    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
      play("type");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTyping(null);
    setHistoryIndex(null);
    setInput(event.target.value);
  };

  const handleTerminalClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.closest("button, a")) inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.62, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[680px] select-text"
    >
      <div
        ref={terminalRef}
        role="region"
        aria-label={lang({ en: "Interactive portfolio terminal", vi: "Terminal portfolio tương tác" })}
        onClick={handleTerminalClick}
        className="flex h-[430px] min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-slate-900/90 bg-white/90 font-mono text-[13px] shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 backdrop-blur-xl sm:h-[470px] sm:text-sm lg:h-[clamp(430px,58vh,610px)] lg:text-[15px] dark:border-white/90 dark:bg-slate-950/90 dark:shadow-black/45 dark:ring-white/10"
      >
        <div className="flex min-h-11 items-center gap-3 bg-black px-4 text-white dark:bg-white dark:text-black">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <AnimatedTerminalIcon
              reduceMotion={reduceMotion}
              className="h-4 w-4 text-teal-300 sm:h-[18px] sm:w-[18px] dark:text-teal-600"
            />
            <span className="truncate text-xs font-semibold sm:text-[13px]">
              {TERMINAL_IDENTITY.username}@{TERMINAL_IDENTITY.host}:{TERMINAL_IDENTITY.cwd}
            </span>
          </div>

          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 dark:text-slate-600 dark:hover:bg-black/10 dark:hover:text-black dark:focus-visible:outline-teal-600"
            aria-label={muted
              ? lang({ en: "Enable terminal sounds", vi: "Bật âm thanh terminal" })
              : lang({ en: "Mute terminal sounds", vi: "Tắt âm thanh terminal" })}
            title={muted ? "Sound off" : "Sound on"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div
          ref={scrollRef}
          data-testid="terminal-output"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 text-slate-700 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5 dark:text-slate-200"
        >
          <div className="space-y-2 leading-relaxed">
            <p className="text-lg font-bold text-slate-950 sm:text-xl dark:text-white">
              Welcome to {siteConfig.name}&apos;s Portfolio Terminal v{TERMINAL_IDENTITY.version}
            </p>
            <p className="max-w-3xl">
              {lang({
                en: "I am a conversational OS assistant. Type ",
                vi: "Tôi là trợ lý OS tương tác. Gõ ",
              })}
              <button
                type="button"
                onClick={() => handleQuickCommand("help")}
                className="font-semibold text-emerald-600 underline-offset-4 transition-colors hover:text-emerald-500 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                help
              </button>
              {lang({
                en: " for commands, or choose a quick command below.",
                vi: " để xem lệnh hoặc chọn một quick command bên dưới.",
              })}
            </p>
          </div>

          <div aria-live="polite" aria-atomic="false" className="mt-5 space-y-3">
            {entries.map((entry) => (
              <div key={entry.id}>
                {entry.type === "command" ? (
                  <div className="flex min-w-0 gap-2">
                    <Prompt />
                    <span className="break-all font-semibold text-cyan-700 dark:text-cyan-300">
                      {entry.command}
                    </span>
                  </div>
                ) : (
                  <TerminalOutputView output={entry.output} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex min-w-0 items-center gap-2" data-testid="terminal-prompt">
            <Prompt />
            <div className="relative min-w-0 flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={unlock}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label={lang({ en: "Terminal command input", vi: "Ô nhập lệnh terminal" })}
                className="relative z-10 w-full border-0 bg-transparent p-0 font-mono font-semibold text-teal-700 caret-teal-500 outline-none dark:text-teal-300"
              />
              {completionRemainder && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 flex whitespace-pre text-slate-400/70 dark:text-slate-500"
                  style={{ paddingLeft: `${input.length}ch` }}
                >
                  <span>{completionRemainder}</span>
                  <span className="ml-2 -translate-y-px rounded border border-slate-300 bg-slate-200 px-1 py-px text-[9px] leading-4 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Tab
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/90 px-4 py-3 dark:border-slate-200 dark:bg-white">
          <div className="flex items-start gap-3">
            <span className="shrink-0 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px] dark:text-slate-600">
              {lang({ en: "Quick commands", vi: "Lệnh nhanh" })}:
            </span>
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {QUICK_COMMANDS.filter((command) => command !== "clear").map((command) => (
                  <button
                    key={command}
                    type="button"
                    onClick={() => handleQuickCommand(command)}
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 sm:text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                  >
                    {command}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleQuickCommand("clear")}
                className="ml-auto shrink-0 rounded-md border border-rose-300 px-2.5 py-1 text-[11px] font-bold text-rose-700 transition-all hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 sm:text-xs dark:border-rose-300 dark:text-rose-700 dark:hover:bg-rose-50"
              >
                [clear]
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
