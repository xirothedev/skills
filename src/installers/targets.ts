export const AGENTS = [
  "codex",
  "claude",
  "cursor",
  "windsurf",
  "gemini",
  "copilot",
  "cline",
  "roo",
  "continue",
  "aider",
  "opencode",
] as const;

export type AgentName = (typeof AGENTS)[number];

export type InstallTarget = {
  agent: AgentName;
  description: string;
  files: Array<{
    from: string;
    to: string;
  }>;
  skillCopy?: {
    to: string;
  };
};

export const INSTALL_TARGETS: Record<AgentName, InstallTarget> = {
  codex: {
    agent: "codex",
    description: "Codex skill root plus AGENTS navigation",
    files: [{ from: "codex/AGENTS.md", to: "AGENTS.md" }],
    skillCopy: { to: ".agents/skills/nestjs-best-practices" },
  },
  claude: {
    agent: "claude",
    description: "Claude Code skill root plus CLAUDE.md guidance",
    files: [{ from: "claude/CLAUDE.md", to: "CLAUDE.md" }],
    skillCopy: { to: ".claude/skills/nestjs-best-practices" },
  },
  cursor: {
    agent: "cursor",
    description: "Cursor MDC project rule",
    files: [{ from: "cursor/.cursor/rules/nestjs-best-practices.mdc", to: ".cursor/rules/nestjs-best-practices.mdc" }],
  },
  windsurf: {
    agent: "windsurf",
    description: "Windsurf project rule",
    files: [{ from: "windsurf/.windsurf/rules/nestjs-best-practices.md", to: ".windsurf/rules/nestjs-best-practices.md" }],
  },
  gemini: {
    agent: "gemini",
    description: "Gemini CLI project instruction file",
    files: [{ from: "gemini/GEMINI.md", to: "GEMINI.md" }],
  },
  copilot: {
    agent: "copilot",
    description: "GitHub Copilot repository instructions",
    files: [{ from: "copilot/.github/copilot-instructions.md", to: ".github/copilot-instructions.md" }],
  },
  cline: {
    agent: "cline",
    description: "Cline rules",
    files: [{ from: "cline/.clinerules/nestjs-best-practices.md", to: ".clinerules/nestjs-best-practices.md" }],
  },
  roo: {
    agent: "roo",
    description: "Roo Code rules",
    files: [{ from: "roo/.roo/rules/nestjs-best-practices.md", to: ".roo/rules/nestjs-best-practices.md" }],
  },
  continue: {
    agent: "continue",
    description: "Continue rule document",
    files: [{ from: "continue/.continue/rules/nestjs-best-practices.md", to: ".continue/rules/nestjs-best-practices.md" }],
  },
  aider: {
    agent: "aider",
    description: "Aider conventions document",
    files: [{ from: "aider/CONVENTIONS.md", to: "CONVENTIONS.md" }],
  },
  opencode: {
    agent: "opencode",
    description: "OpenCode scoped AGENTS.md guidance",
    files: [{ from: "opencode/.opencode/AGENTS.md", to: ".opencode/AGENTS.md" }],
  },
};

export function parseAgent(value: string): AgentName | "all" {
  if (value === "all") return "all";
  if ((AGENTS as readonly string[]).includes(value)) return value as AgentName;
  throw new Error(`Unsupported agent "${value}". Supported: ${["all", ...AGENTS].join(", ")}`);
}
