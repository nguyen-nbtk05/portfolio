export const TERMINAL_IDENTITY = {
  username: "visitor",
  host: "portfolio-os",
  cwd: "~",
  version: "2.0.0",
} as const;

export const OPEN_TARGETS = ["about", "skills", "projects", "blog", "contact"] as const;
export const VIRTUAL_FILES = [
  "about.txt",
  "skills.json",
  "projects.md",
  "contact.cfg",
] as const;
export const TERMINAL_THEMES = [
  "default",
  "cyber-green",
  "amber-decay",
  "monochrome",
] as const;

export type OpenTarget = (typeof OPEN_TARGETS)[number];
export type VirtualFile = (typeof VIRTUAL_FILES)[number];
export type TerminalThemeTarget = (typeof TERMINAL_THEMES)[number];
export type SiteThemeTarget = "light" | "dark" | "system";

export type TerminalOutput =
  | { type: "help" }
  | { type: "list" }
  | { type: "file"; file: VirtualFile }
  | { type: "about" }
  | { type: "skills" }
  | { type: "projects" }
  | { type: "contact" }
  | { type: "theme-help" }
  | { type: "theme"; target: TerminalThemeTarget }
  | { type: "site-theme"; target: SiteThemeTarget }
  | { type: "exit" }
  | { type: "assistant"; response: "greeting" | "fallback" }
  | { type: "open"; target: OpenTarget }
  | { type: "usage"; command: "cat" | "theme" | "site-theme" | "open" };

export type TerminalAction =
  | { type: "clear" }
  | { type: "terminal-theme"; target: TerminalThemeTarget }
  | { type: "site-theme"; target: SiteThemeTarget }
  | { type: "open"; target: OpenTarget };

export interface TerminalCommandResult {
  output?: TerminalOutput;
  action?: TerminalAction;
}

export type TerminalEntry =
  | { id: number; type: "command"; command: string }
  | { id: number; type: "output"; output: TerminalOutput };

export const QUICK_COMMANDS = [
  "ls",
  "cat about.txt",
  "skills",
  "projects",
  "theme",
  "contact",
  "clear",
] as const;

export const COMMAND_COMPLETIONS = [
  "help",
  "clear",
  "ls",
  ...VIRTUAL_FILES.map((file) => `cat ${file}`),
  "about",
  "skills",
  "projects",
  "contact",
  "theme",
  ...TERMINAL_THEMES.map((theme) => `theme ${theme}`),
  "site-theme light",
  "site-theme dark",
  "site-theme system",
  "exit",
  ...OPEN_TARGETS.map((target) => `open ${target}`),
] as const;

function tokenize(rawCommand: string): string[] {
  const tokens: string[] = [];
  const matcher = /"([^"]*)"|'([^']*)'|[^\s]+/g;

  for (const match of rawCommand.matchAll(matcher)) {
    tokens.push(match[1] ?? match[2] ?? match[0]);
  }

  return tokens;
}

function isOpenTarget(value: string): value is OpenTarget {
  return (OPEN_TARGETS as readonly string[]).includes(value);
}

function isVirtualFile(value: string): value is VirtualFile {
  return (VIRTUAL_FILES as readonly string[]).includes(value);
}

function isTerminalTheme(value: string): value is TerminalThemeTarget {
  return (TERMINAL_THEMES as readonly string[]).includes(value);
}

function isSiteTheme(value: string): value is SiteThemeTarget {
  return value === "light" || value === "dark" || value === "system";
}

function conversationalResponse(rawCommand: string): TerminalCommandResult {
  const normalized = rawCommand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/\b(project|projects|du an|portfolio)\b/.test(normalized)) {
    return { output: { type: "projects" } };
  }

  if (/\b(skill|skills|technology|technologies|tech stack|ky nang|cong nghe)\b/.test(normalized)) {
    return { output: { type: "skills" } };
  }

  if (/\b(contact|email|reach|message|lien he)\b/.test(normalized)) {
    return { output: { type: "contact" } };
  }

  if (/\b(who|name|about|profile|ban la ai|gioi thieu)\b/.test(normalized)) {
    return { output: { type: "about" } };
  }

  if (/\b(hello|hi|hey|xin chao|chao)\b/.test(normalized)) {
    return { output: { type: "assistant", response: "greeting" } };
  }

  return { output: { type: "assistant", response: "fallback" } };
}

export function executeTerminalCommand(rawCommand: string): TerminalCommandResult {
  const tokens = tokenize(rawCommand.trim());
  const command = tokens[0]?.toLowerCase();
  const args = tokens.slice(1).map((token) => token.toLowerCase());

  if (!command) return {};

  switch (command) {
    case "help":
      return { output: { type: "help" } };
    case "clear":
      return { action: { type: "clear" } };
    case "ls":
      return { output: { type: "list" } };
    case "about":
      return { output: { type: "about" } };
    case "cat":
      return args.length === 1 && isVirtualFile(args[0])
        ? { output: { type: "file", file: args[0] } }
        : { output: { type: "usage", command: "cat" } };
    case "skills":
      return { output: { type: "skills" } };
    case "projects":
      return { output: { type: "projects" } };
    case "contact":
      return { output: { type: "contact" } };
    case "theme": {
      if (args.length === 0) return { output: { type: "theme-help" } };

      if (args.length === 1 && isTerminalTheme(args[0])) {
        return {
          output: { type: "theme", target: args[0] },
          action: { type: "terminal-theme", target: args[0] },
        };
      }

      // Backwards compatibility with the terminal's previous website-theme command.
      if (args.length === 1 && isSiteTheme(args[0])) {
        return {
          output: { type: "site-theme", target: args[0] },
          action: { type: "site-theme", target: args[0] },
        };
      }

      return { output: { type: "usage", command: "theme" } };
    }
    case "site-theme":
      return args.length === 1 && isSiteTheme(args[0])
        ? {
            output: { type: "site-theme", target: args[0] },
            action: { type: "site-theme", target: args[0] },
          }
        : { output: { type: "usage", command: "site-theme" } };
    case "exit":
      return { output: { type: "exit" } };
    case "open": {
      if (args.length === 1 && isOpenTarget(args[0])) {
        return {
          output: { type: "open", target: args[0] },
          action: { type: "open", target: args[0] },
        };
      }

      return { output: { type: "usage", command: "open" } };
    }
    default:
      return conversationalResponse(rawCommand);
  }
}

export function getTerminalCompletion(value: string): string | null {
  const normalized = value.trimStart().toLowerCase();
  if (!normalized) return null;

  return (
    COMMAND_COMPLETIONS.find(
      (candidate) => candidate.startsWith(normalized) && candidate !== normalized,
    ) ?? null
  );
}
