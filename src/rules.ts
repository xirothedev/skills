import { basename } from "node:path";
import { referencesDir } from "./paths";
import { listFiles, parseFrontmatter, readText } from "./fs-utils";

export type Rule = {
  file: string;
  id: string;
  prefix: string;
  title: string;
  impact: string;
  tags: string;
  dataset: string;
};

export async function loadRules(skillName: string): Promise<Rule[]> {
  const refsDir = referencesDir(skillName);
  const files = await listFiles(refsDir, ".md");
  const rules: Rule[] = [];
  for (const file of files) {
    if (basename(file.path).startsWith("_")) continue;
    const content = await readText(file.path);
    const frontmatter = parseFrontmatter(content);
    const id = basename(file.path, ".md");
    const prefix = id.split("-")[0] ?? "";
    rules.push({
      file: file.relativePath,
      id,
      prefix,
      title: frontmatter.title ?? id,
      impact: frontmatter.impact ?? "UNSPECIFIED",
      tags: frontmatter.tags ?? "",
      dataset: frontmatter.dataset ?? "",
    });
  }
  return rules.sort((a, b) => a.id.localeCompare(b));
}

export function groupRulesByPrefix(rules: Rule[]): Map<string, Rule[]> {
  const groups = new Map<string, Rule[]>();
  for (const rule of rules) {
    const existing = groups.get(rule.prefix) ?? [];
    existing.push(rule);
    groups.set(rule.prefix, existing);
  }
  return groups;
}
