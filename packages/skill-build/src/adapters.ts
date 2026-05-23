import { join } from "node:path";
import { ADAPTERS_DIR, skillDir } from "../../../src/paths";
import { writeText } from "../../../src/fs-utils";
import { loadRules } from "../../../src/rules";

export async function buildAdapters(skillName: string): Promise<void> {
  const rules = await loadRules(skillName);
  const ruleIndex = rules.map((rule) => `- ${rule.id}: ${rule.title}`).join("\n");

  const skill = await import("node:fs/promises").then((fs) => fs.readFile(join(skillDir(skillName), "SKILL.md"), "utf8"));
  const description = skill.match(/^description:\s*(.*)$/m)?.[1] ?? `${skillName} best practices`;

  const summary = `# ${skillName.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}\n\n${description}\n\nRead the skill navigation first, then load only relevant rules and dataset cases.\n\n## Rule Index\n\n${ruleIndex}\n`;

  const adapters: Array<{ path: string; content: string }> = [
    { path: `cursor/.cursor/rules/${skillName}.mdc`, content: cursorMdc(summary) },
    { path: `windsurf/.windsurf/rules/${skillName}.md`, content: summary },
    { path: `gemini/GEMINI.md`, content: summary },
    { path: `copilot/.github/copilot-instructions.md`, content: summary },
    { path: `cline/.clinerules/${skillName}.md`, content: summary },
    { path: `roo/.roo/rules/${skillName}.md`, content: summary },
    { path: `continue/.continue/rules/${skillName}.md`, content: summary },
    { path: `aider/CONVENTIONS.md`, content: summary },
    { path: `opencode/.opencode/AGENTS.md`, content: summary },
    { path: `claude/CLAUDE.md`, content: summary },
    { path: `codex/AGENTS.md`, content: summary },
    { path: `claude-code/.claude/skills/${skillName}/CLAUDE.md`, content: summary },
  ];

  for (const adapter of adapters) {
    await writeText(join(ADAPTERS_DIR, adapter.path), adapter.content);
  }
}

function cursorMdc(content: string): string {
  return `---\ndescription: ${content.split("\n")[0] ?? "Best practices"}\nalwaysApply: false\n---\n\n${content}`;
}
