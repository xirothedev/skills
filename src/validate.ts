import { join } from "node:path";
import { DATASET_DIR, ROOT, SKILL_DIR, SOURCES_DIR } from "./paths";
import { exists, listFiles, parseFrontmatter, readText } from "./fs-utils";
import { SECTION_PREFIXES, loadRules } from "./rules";
import { AGENTS } from "./installers/targets";

export async function validate(): Promise<void> {
  const errors: string[] = [];

  const packageJson = JSON.parse(await readText(join(ROOT, "package.json"))) as {
    scripts?: Record<string, string>;
  };
  for (const [name, script] of Object.entries(packageJson.scripts ?? {})) {
    if (["build", "validate", "install", "research:index"].includes(name) && !script.startsWith("bun ")) {
      errors.push(`script ${name} must use bun runtime`);
    }
  }

  const skill = await readText(join(SKILL_DIR, "SKILL.md"));
  const skillFrontmatter = parseFrontmatter(skill);
  if (skillFrontmatter.name !== "nestjs-best-practices") {
    errors.push("SKILL.md frontmatter name must be nestjs-best-practices");
  }
  if (!skillFrontmatter.description?.includes("NestJS")) {
    errors.push("SKILL.md description must mention NestJS");
  }
  if (!skill.includes("Load On Demand")) {
    errors.push("SKILL.md must document load-on-demand behavior");
  }

  const rules = await loadRules();
  for (const prefix of SECTION_PREFIXES) {
    if (!rules.some((rule) => rule.prefix === prefix)) {
      errors.push(`missing rule for prefix ${prefix}-`);
    }
  }
  for (const rule of rules) {
    if (!rule.dataset) {
      errors.push(`${rule.id} missing dataset frontmatter`);
      continue;
    }
    const datasetPath = join(DATASET_DIR, rule.dataset);
    for (const file of ["incorrect.ts", "correct.ts", "notes.md"]) {
      if (!(await exists(join(datasetPath, file)))) {
        errors.push(`${rule.id} dataset missing ${rule.dataset}/${file}`);
      }
    }
  }

  const sourceFiles = await listFiles(SOURCES_DIR, ".json");
  if (sourceFiles.length === 0) errors.push("sources directory must include source metadata");

  if (await exists(join(SOURCES_DIR, "prisma-installed-skills.json"))) {
    errors.push("shared skill must not bundle prisma-installed-skills.json; suggest $find-skills instead");
  }
  if (await exists(join(SKILL_DIR, "subskills", "database", "prisma"))) {
    errors.push("shared skill must not bundle Prisma subskills; suggest $find-skills instead");
  }

  const openai = await readText(join(SKILL_DIR, "agents", "openai.yaml"));
  if (!openai.includes("$nestjs-best-practices")) {
    errors.push("agents/openai.yaml default prompt must mention $nestjs-best-practices");
  }

  const metadata = JSON.parse(await readText(join(SKILL_DIR, "metadata.json"))) as {
    version?: string;
    frameworkVersion?: string;
    references?: string[];
  };
  if (!metadata.version) errors.push("metadata.json missing version");
  if (!metadata.frameworkVersion?.startsWith("v11.")) {
    errors.push("metadata.json frameworkVersion must record the NestJS v11 baseline");
  }
  if (!metadata.references?.some((reference) => reference.includes("docs.nestjs.com"))) {
    errors.push("metadata.json references must include official NestJS docs");
  }

  const plugin = JSON.parse(await readText(join(ROOT, ".codex-plugin", "plugin.json"))) as {
    marketplace?: { supports?: string[] };
  };
  const supported = new Set(plugin.marketplace?.supports ?? []);
  for (const agent of AGENTS) {
    if (!supported.has(agent)) errors.push(`plugin metadata missing support for ${agent}`);
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    throw new Error(`validation failed with ${errors.length} error(s)`);
  }

  console.log(`validated rules=${rules.length} sources=${sourceFiles.length} agents=${AGENTS.length}`);
}
