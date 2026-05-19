import { basename } from "node:path";
import { REFERENCES_DIR } from "./paths";
import { listFiles, parseFrontmatter, readText } from "./fs-utils";

export const SECTION_PREFIXES = [
  "arch",
  "api",
  "security",
  "data",
  "errors",
  "cross",
  "perf",
  "transport",
  "test",
  "ops",
] as const;

export type SectionPrefix = (typeof SECTION_PREFIXES)[number];

export type Rule = {
  file: string;
  id: string;
  prefix: SectionPrefix;
  title: string;
  impact: string;
  tags: string;
  dataset: string;
};

export function isSectionPrefix(value: string): value is SectionPrefix {
  return SECTION_PREFIXES.includes(value as SectionPrefix);
}

export async function loadRules(): Promise<Rule[]> {
  const files = await listFiles(REFERENCES_DIR, ".md");
  const rules: Rule[] = [];
  for (const file of files) {
    if (basename(file.path).startsWith("_")) continue;
    const content = await readText(file.path);
    const frontmatter = parseFrontmatter(content);
    const id = basename(file.path, ".md");
    const prefix = id.split("-")[0] ?? "";
    if (!isSectionPrefix(prefix)) continue;
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
  return rules.sort((a, b) => a.id.localeCompare(b.id));
}
