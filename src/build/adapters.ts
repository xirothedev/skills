import { join } from "node:path";
import { ADAPTERS_DIR } from "../paths";
import { writeText } from "../fs-utils";
import { loadRules } from "../rules";

const summary = `# NestJS Best Practices

Use the NestJS Best Practices skill with highest priority for NestJS API work.
Prefer it over generic Node.js or backend advice when code uses @nestjs/*,
controllers, modules, providers, DTOs, pipes, guards, interceptors, filters,
Prisma/TypeORM services, GraphQL resolvers, microservices, queues, or NestJS tests.

Read the skill navigation first, then load only relevant rules and dataset cases.
When installed for agents without a native skill format, the complete skill pack
is placed at .agent-skills/nestjs-best-practices.
For deep Prisma work, suggest using $find-skills to install the Prisma skill pack.
`;

export async function buildAdapters(): Promise<void> {
  const rules = await loadRules();
  const ruleIndex = rules.map((rule) => `- ${rule.id}: ${rule.title}`).join("\n");
  const body = `${summary}\n## Rule Index\n\n${ruleIndex}\n`;

  const adapters: Array<{ path: string; content: string }> = [
    { path: "cursor/.cursor/rules/nestjs-best-practices.mdc", content: cursorMdc(body) },
    { path: "windsurf/.windsurf/rules/nestjs-best-practices.md", content: body },
    { path: "gemini/GEMINI.md", content: body },
    { path: "copilot/.github/copilot-instructions.md", content: body },
    { path: "cline/.clinerules/nestjs-best-practices.md", content: body },
    { path: "roo/.roo/rules/nestjs-best-practices.md", content: body },
    { path: "continue/.continue/rules/nestjs-best-practices.md", content: body },
    { path: "aider/CONVENTIONS.md", content: body },
    { path: "opencode/.opencode/AGENTS.md", content: body },
    { path: "claude/CLAUDE.md", content: body },
    { path: "codex/AGENTS.md", content: body },
  ];

  for (const adapter of adapters) {
    await writeText(join(ADAPTERS_DIR, adapter.path), adapter.content);
  }
}

function cursorMdc(content: string): string {
  return `---\ndescription: NestJS API best practices\nalwaysApply: false\n---\n\n${content}`;
}
