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
import { ChevronRight, FileText, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage } from "@/hooks/use-language";
import { useLenis } from "@/hooks/use-lenis";
import {
  getHomeSectionIdFromHash,
  pushHomeSectionHash,
} from "@/lib/section-navigation";
import { siteConfig } from "@/data/config";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { requestProjectSelection } from "@/lib/project-navigation";
import { AnimatedTerminalIcon } from "@/components/ui/animated-terminal-icon";
import {
  QUICK_COMMANDS,
  TERMINAL_IDENTITY,
  VIRTUAL_FILES,
  executeTerminalCommand,
  getTerminalCompletion,
  type OpenTarget,
  type TerminalEntry,
  type TerminalOutput,
  type TerminalThemeTarget,
  type VirtualFile,
} from "@/components/sections/terminal-engine";

const SOUND_STORAGE_KEY = "portfolio-terminal-muted";
const TERMINAL_THEME_STORAGE_KEY = "portfolio-terminal-theme";

const FILE_SECTION_TARGETS: Record<VirtualFile, OpenTarget> = {
  "about.txt": "about",
  "skills.json": "skills",
  "projects.md": "projects",
  "contact.cfg": "contact",
};

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

interface TerminalOutputViewProps {
  output: TerminalOutput;
  onCommand: (command: string) => void;
  onNavigate: (target: OpenTarget) => void;
  onProjectSelect: (projectId: number) => void;
}

function TerminalOutputView({
  output,
  onCommand,
  onNavigate,
  onProjectSelect,
}: TerminalOutputViewProps) {
  const { lang, language } = useLanguage();

  if (output.type === "help") {
    const commands = [
      ["help", lang({ en: "show this command guide", vi: "hiển thị hướng dẫn lệnh" })],
      ["ls", lang({ en: "list virtual portfolio files", vi: "liệt kê tệp portfolio ảo" })],
      ["cat about.txt | about", lang({ en: "read the short profile", vi: "đọc phần giới thiệu ngắn" })],
      ["skills | projects | contact", lang({ en: "print portfolio information", vi: "in thông tin portfolio" })],
      ["theme [name]", lang({ en: "customize the terminal palette", vi: "đổi bảng màu terminal" })],
      ["site-theme [light|dark|system]", lang({ en: "change the website theme", vi: "đổi giao diện website" })],
      ["open <section>", lang({ en: "navigate to a portfolio section", vi: "đi tới một phần của portfolio" })],
      ["exit", lang({ en: "close the terminal session", vi: "đóng phiên terminal" })],
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
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {lang({ en: "Portfolio file index", vi: "Danh mục tệp portfolio" })}
          <span className="ml-2 normal-case tracking-normal text-slate-400 dark:text-slate-500">
            ~/{TERMINAL_IDENTITY.host}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {VIRTUAL_FILES.map((file) => (
            <button
              key={file}
              type="button"
              data-terminal-file={file}
              onClick={() => onNavigate(FILE_SECTION_TARGETS[file])}
              className="terminal-file-item group flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              aria-label={lang({
                en: `Open ${FILE_SECTION_TARGETS[file]} section`,
                vi: `Mở phần ${FILE_SECTION_TARGETS[file]}`,
              })}
            >
              <FileText className="h-4 w-4 shrink-0 text-teal-500" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-semibold text-teal-700 dark:text-teal-300">{file}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-500" aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="text-[0.9em] text-slate-500 dark:text-slate-400">
          {lang({ en: "Select a file to jump to its section, or read it with", vi: "Chọn tệp để tới section tương ứng, hoặc đọc bằng lệnh" })}{" "}
          <code className="font-semibold text-slate-700 dark:text-slate-200">cat &lt;filename&gt;</code>
        </p>
      </div>
    );
  }

  if (output.type === "file") {
    if (output.file === "about.txt") {
      return (
        <div className="terminal-output-card overflow-hidden rounded-xl border">
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="font-bold text-slate-950 dark:text-white">{siteConfig.name}</div>
              <div className="mt-0.5 text-[0.9em] font-semibold text-teal-700 dark:text-teal-300">
                {lang({ en: "Computer Networks & Data Communications", vi: "Mạng máy tính & Truyền thông dữ liệu" })}
              </div>
            </div>
          </div>
          <p
            lang={language}
            className="hyphens-auto border-t border-inherit px-4 py-3 text-justify leading-relaxed text-slate-600 [text-align-last:left] [text-justify:inter-word] dark:text-slate-300"
          >
            {lang(siteConfig.about)}
          </p>
        </div>
      );
    }

    if (output.file === "skills.json") {
      const skillRegistry = Object.fromEntries(
        skills.map((group) => [lang(group.category), group.items.map((item) => item.label)]),
      );

      return (
        <div className="space-y-2">
          <div className="font-semibold text-teal-700 dark:text-teal-300">[ Technical Skills ]</div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-[0.92em] leading-relaxed">
            {JSON.stringify(skillRegistry, null, 2)}
          </pre>
        </div>
      );
    }

    if (output.file === "projects.md") {
      return (
        <div className="space-y-4">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              data-terminal-project={project.id}
              onClick={() => onProjectSelect(project.id)}
              className="group block w-full rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:border-teal-400/60 hover:bg-teal-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <div className="flex items-center justify-between gap-3 font-bold uppercase text-teal-700 dark:text-teal-300">
                <span>## {lang(project.title)}</span>
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
              <p className="mt-1 leading-relaxed">{lang(project.description)}</p>
              <div className="mt-1 text-slate-500 dark:text-slate-400">Stack: {project.techStack.join(" / ")}</div>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="font-semibold text-teal-700 dark:text-teal-300">[ Connection Matrix Configuration ]</div>
        <div>EMAIL = {siteConfig.email}</div>
        <div>GITHUB = {siteConfig.github}</div>
        <div>TELEGRAM = {siteConfig.telegram}</div>
      </div>
    );
  }

  if (output.type === "about") {
    return <p className="max-w-3xl leading-relaxed">{lang(siteConfig.about)}</p>;
  }

  if (output.type === "skills") {
    return (
      <div className="space-y-2">
        {skills.map((group) => (
          <div key={group.category.en}>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {lang(group.category)}:
            </span>{" "}
            <span>{group.items.map((item) => item.label).join(" · ")}</span>
          </div>
        ))}
      </div>
    );
  }

  if (output.type === "projects") {
    return (
      <div className="space-y-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            data-terminal-project={project.id}
            onClick={() => onProjectSelect(project.id)}
            className="group flex w-full items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:border-teal-400/60 hover:bg-teal-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {String(index + 1).padStart(2, "0")}. {lang(project.title)}
            </span>
            <span className="min-w-0 flex-1 truncate text-slate-500 dark:text-slate-400">
              — {project.techStack.join(" / ")}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" aria-hidden="true" />
          </button>
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

  if (output.type === "theme-help") {
    const themes = [
      ["default", lang({ en: "portfolio default", vi: "mặc định của portfolio" })],
      ["cyber-green", lang({ en: "lime phosphor screen", vi: "màn hình phosphor xanh" })],
      ["amber-decay", lang({ en: "amber CRT glow", vi: "ánh CRT màu hổ phách" })],
      ["monochrome", lang({ en: "high-contrast black and white", vi: "đen trắng tương phản cao" })],
    ];

    return (
      <div className="space-y-2">
        <div className="font-bold text-teal-700 dark:text-teal-300">[ RETRO THEME COMMAND PANEL ]</div>
        <p>{lang({ en: "Type theme <name> to customize this terminal:", vi: "Gõ theme <tên> để tùy chỉnh terminal:" })}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {themes.map(([name, description]) => (
            <button
              key={name}
              type="button"
              data-terminal-theme-option={name}
              onClick={() => onCommand(`theme ${name}`)}
              className="group flex items-center justify-between gap-3 rounded-lg border border-slate-300/70 px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-500/5 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:border-slate-700"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-cyan-700 dark:text-cyan-300">theme {name}</span>
                <span className="block truncate text-[0.85em] text-slate-500 dark:text-slate-400">{description}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (output.type === "theme") {
    return (
      <div className="space-y-1 text-emerald-700 dark:text-emerald-300">
        <p>⚡ {lang({ en: `Terminal palette recalibrated to: ${output.target.toUpperCase()}`, vi: `Bảng màu terminal đã chuyển sang: ${output.target.toUpperCase()}` })}</p>
        <p>{lang({ en: "Spectrum filters updated for the terminal frame.", vi: "Bộ lọc quang phổ đã được cập nhật cho khung terminal." })}</p>
      </div>
    );
  }

  if (output.type === "site-theme") {
    return (
      <p className="text-emerald-700 dark:text-emerald-300">
        {lang({ en: `Website theme changed to ${output.target}.`, vi: `Giao diện website đã chuyển sang ${output.target}.` })}
      </p>
    );
  }

  if (output.type === "exit") {
    return (
      <p>{lang({ en: "Connection closed. Thank you for visiting! Type help to start a new session.", vi: "Kết nối đã đóng. Cảm ơn bạn đã ghé thăm! Gõ help để bắt đầu phiên mới." })}</p>
    );
  }

  if (output.type === "assistant") {
    return output.response === "greeting" ? (
      <div className="space-y-1">
        <p>{lang({ en: `Hello! I'm ${siteConfig.name}'s virtual assistant. How can I help?`, vi: `Xin chào! Tôi là trợ lý ảo của ${siteConfig.name}. Tôi có thể giúp gì cho bạn?` })}</p>
        <p className="text-slate-500 dark:text-slate-400">{lang({ en: "Ask about skills, projects, or contact information.", vi: "Hãy hỏi về kỹ năng, dự án hoặc thông tin liên hệ." })}</p>
      </div>
    ) : (
      <p>{lang({ en: "I'm ready to present this portfolio. Ask about 'skills', 'projects', or 'contact', or type 'help' to see every command.", vi: "Tôi sẵn sàng giới thiệu portfolio này. Hãy hỏi về 'skills', 'projects', 'contact', hoặc gõ 'help' để xem toàn bộ lệnh." })}</p>
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
      cat: "cat <about.txt|skills.json|projects.md|contact.cfg>",
      theme: "theme <default|cyber-green|amber-decay|monochrome>",
      "site-theme": "site-theme <light|dark|system>",
      open: "open <about|skills|projects|blog|contact>",
    }[output.command];

    return <p className="text-amber-700 dark:text-amber-300">usage: {usage}</p>;
  }

  return null;
}

export function PortfolioTerminal() {
  const { lang } = useLanguage();
  const { setTheme } = useTheme();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const { muted, play, toggle, unlock } = useTerminalAudio();
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [typing, setTyping] = useState<{ command: string; index: number } | null>(null);
  const [terminalTheme, setTerminalTheme] = useState<TerminalThemeTarget>("default");
  const entryIdRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const savedTheme = window.localStorage.getItem(TERMINAL_THEME_STORAGE_KEY);
      if (
        savedTheme === "default" ||
        savedTheme === "cyber-green" ||
        savedTheme === "amber-decay" ||
        savedTheme === "monochrome"
      ) {
        setTerminalTheme(savedTheme);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
      const sectionId = getHomeSectionIdFromHash(`#${target}`);
      if (!sectionId) return;

      const element = document.getElementById(sectionId);
      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element, { duration: 1.2, offset: 0 });
      } else {
        element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }

      pushHomeSectionHash(sectionId);
    },
    [lenis, reduceMotion],
  );

  const navigateToProject = useCallback(
    (projectId: number) => {
      requestProjectSelection(projectId);
      navigateToSection("projects");
    },
    [navigateToSection],
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

      const output = result.output;

      if (result.action?.type === "terminal-theme") {
        setTerminalTheme(result.action.target);
        window.localStorage.setItem(TERMINAL_THEME_STORAGE_KEY, result.action.target);
      }

      if (result.action?.type === "site-theme") {
        setTheme(result.action.target);
      }

      if (result.action?.type === "open") {
        navigateToSection(result.action.target);
      }

      appendEntries(command, output);
      play(output?.type === "usage" ? "error" : "action");
    },
    [appendEntries, navigateToSection, play, setTheme],
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
      data-cursor="auto"
      initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.62, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto min-w-0 w-full max-w-[690px] select-text"
    >
      <div
        ref={terminalRef}
        data-terminal-theme={terminalTheme}
        role="region"
        aria-label={lang({ en: "Interactive portfolio terminal", vi: "Terminal portfolio tương tác" })}
        onClick={handleTerminalClick}
        className="portfolio-terminal terminal-maple-mono flex h-[clamp(320px,52svh,390px)] min-h-0 flex-col overflow-hidden rounded-2xl border-2 text-xs backdrop-blur-xl sm:h-[min(470px,58svh)] sm:text-[13px] lg:h-[clamp(430px,58vh,610px)] lg:text-sm"
      >
        <div className="portfolio-terminal-header flex min-h-11 items-center gap-3 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <AnimatedTerminalIcon
              reduceMotion={reduceMotion}
              className="h-4 w-4 text-teal-300 sm:h-[18px] sm:w-[18px] dark:text-teal-600"
            />
            <span className="truncate text-[11px] font-semibold sm:text-xs">
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
          className="portfolio-terminal-body min-h-0 flex-1 overflow-y-auto px-4 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5"
        >
          <div className="space-y-2 leading-relaxed">
            <p className="portfolio-terminal-heading text-[17px] font-bold sm:text-[19px]">
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
                  <TerminalOutputView
                    output={entry.output}
                    onCommand={handleQuickCommand}
                    onNavigate={navigateToSection}
                    onProjectSelect={navigateToProject}
                  />
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

        <div className="portfolio-terminal-quickbar border-t px-4 py-3">
          <div className="flex items-start gap-3 max-sm:flex-col max-sm:gap-2">
            <span className="shrink-0 pt-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px] dark:text-slate-600">
              {lang({ en: "Quick commands", vi: "Lệnh nhanh" })}:
            </span>
            <div className="flex min-w-0 flex-1 items-start gap-2 max-sm:w-full">
              <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {QUICK_COMMANDS.filter((command) => command !== "clear").map((command) => (
                  <button
                    key={command}
                    type="button"
                    onClick={() => handleQuickCommand(command)}
                    className="portfolio-terminal-command rounded-md border px-2.5 py-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-[11px]"
                  >
                    {command}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleQuickCommand("clear")}
                className="ml-auto shrink-0 rounded-md border border-rose-300 px-2.5 py-1 text-[10px] font-bold text-rose-700 transition-all hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 sm:text-[11px] dark:border-rose-300 dark:text-rose-700 dark:hover:bg-rose-50"
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
