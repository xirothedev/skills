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
  "claude-code",
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
    description: "Codex skill markdown file",
    files: [{ from: "codex/skill.md", to: "AGENTS.md" }],
    skillCopy: { to: ".agents/skills/skill" },
  },
  claude: {
    agent: "claude",
    description: "Claude Code skill markdown file",
    files: [{ from: "claude/skill.md", to: "CLAUDE.md" }],
    skillCopy: { to: ".claude/skills/skill" },
  },
  cursor: {
    agent: "cursor",
    description: "Cursor MDC project rule",
    files: [{ from: "cursor/.cursor/rules/skill.mdc", to: ".cursor/rules/skill.mdc" }],
  },
  windsurf: {
    agent: "windsurf",
    description: "Windsurf project rule",
    files: [{ from: "windsurf/.windsurf/rules/skill.md", to: ".windsurf/rules/skill.md" }],
  },
  gemini: {
    agent: "gemini",
    description: "Gemini LI project instruction file",
    files: [{ from: "gemini/skill.md", to: "GEMINI.md" }],
  },
  copilot: {
    agent: "copilot",
    description: "GitHub Copilot repository instructions",
    files: [{ from: "copilot/.github/skill-instructions.md", to: ".github/copilot-instructions.md" }],
  },
  cline: {
    agent: "cline",
    description: "Cline rules",
    files: [{ from: "cline/.clinerules/skill.md", to: ".clinerules/skill.md" }],
  },
  roo: {
    agent: "roo",
    description: "Roo Code rules",
    files: [{ from: "roo/.roo/rules/skill.md", to: ".roo/rules/skill.md" }],
  },
  continue: {
    agent: "continue",
    description: "Continue rule document",
    files: [{ from: "continue/.continue/rules/skill.md", to: ".continue/rules/skill.md" }],
  },
  aider: {
    agent: "aider",
    description: "Aider conventions document",
    files: [{ from: "aider/skill.md", to: "CONVENTIONS.md" }],
  },
  opencode: {
    agent: "opencode",
    description: "OpenCode scoped AGENTS.md guidance",
    files: [{ from: "opencode/.opencode/skill.md", to: ".opencode/AGENTS.md" }],
  },
  "claude-code": {
    agent: "claude-code",
    description: "Claude Code skill via .claude/skills/",
    files: [{ from: "claude-code/.claude/skills/skill/CLAUDE.md", to: ".claude/skills/skill/CLAUDE.md" }],
    skillCopy: { to: ".claude/skills/skill" },
  },
};

export function parseAgent(value: string): AgentName | "all" {
  if (value === "all") return "all";
  if ((AGENTS as readonly string[]).includes(value)) return value as AgentName;
  throw new Error(`Unsupported agent "${value}". Supported: ${["all", ...AGENTS].join(", ")}`);
}
