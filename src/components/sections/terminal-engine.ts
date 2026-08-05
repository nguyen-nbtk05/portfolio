export const TERMINAL_IDENTITY = {
  username: "visitor",
  host: "portfolio-os",
  cwd: "~",
  version: "1.0.0",
} as const;

export const OPEN_TARGETS = ["about", "skills", "projects", "blog", "contact"] as const;

export type OpenTarget = (typeof OPEN_TARGETS)[number];
export type ThemeTarget = "light" | "dark" | "system" | "toggle";

export type TerminalOutput =
  | { type: "help" }
  | { type: "list" }
  | { type: "about" }
  | { type: "skills" }
  | { type: "projects" }
  | { type: "contact" }
  | { type: "theme"; target: ThemeTarget }
  | { type: "open"; target: OpenTarget }
  | { type: "usage"; command: "cat" | "theme" | "open" }
  | { type: "unknown"; command: string };

export type TerminalAction =
  | { type: "clear" }
  | { type: "theme"; target: ThemeTarget }
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
  "cat about.txt",
  "about",
  "skills",
  "projects",
  "contact",
  "theme",
  "theme light",
  "theme dark",
  "theme system",
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

function isThemeTarget(value: string): value is Exclude<ThemeTarget, "toggle"> {
  return value === "light" || value === "dark" || value === "system";
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
      return args.length === 1 && args[0] === "about.txt"
        ? { output: { type: "about" } }
        : { output: { type: "usage", command: "cat" } };
    case "skills":
      return { output: { type: "skills" } };
    case "projects":
      return { output: { type: "projects" } };
    case "contact":
      return { output: { type: "contact" } };
    case "theme": {
      if (args.length === 0) {
        return {
          output: { type: "theme", target: "toggle" },
          action: { type: "theme", target: "toggle" },
        };
      }

      if (args.length === 1 && isThemeTarget(args[0])) {
        return {
          output: { type: "theme", target: args[0] },
          action: { type: "theme", target: args[0] },
        };
      }

      return { output: { type: "usage", command: "theme" } };
    }
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
      return { output: { type: "unknown", command } };
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
