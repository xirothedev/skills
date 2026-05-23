import { join } from "node:path";
import { ROOT, SKILLS_DIR, listSkillNames } from "./paths";
import { exists, listFiles, parseFrontmatter, readText } from "./fs-utils";
import { loadRules, groupRulesByPrefix } from "./rules";
import { AGENTS } from "./installers/targets";

async function validateSkill(skillName: string): Promise<string[]> {
  const errors: string[] = [];
  const skillDir = join(SKILLS_DIR, skillName);

  // SKILL.md checks
  const skillPath = join(skillDir, "SKILL.md");
  if (!(await exists(skillPath))) {
    return [`SKILL.md not found for ${skillName}`];
  }
  const skill = await readText(skillPath);
  const skillFm = parseFrontmatter(skill);
  if (!skillFm.name) errors.push(`${skillName}: SKILL.md missing name frontmatter`);
  if (!skillFm.description) errors.push(`${skillName}: SKILL.md missing description frontmatter`);
  if (!skill.includes("Load On Demand")) errors.push(`${skillName}: SKILL.md must document load-on-demand behavior`);

  // metadata.json checks
  const metaPath = join(skillDir, "metadata.json");
  if (await exists(metaPath)) {
    const meta = JSON.parse(await readText(metaPath)) as Record<string, unknown>;
    if (!meta.version) errors.push(`${skillName}: metadata.json missing version`);
    if (!meta.references || !Array.isArray(meta.references) || !meta.references.some((r: string) => r.includes("docs.") || r.includes("/docs"))) {
      errors.push(`${skillName}: metadata.json references should include official docs`);
    }
  } else {
    errors.push(`${skillName}: metadata.json not found`);
  }

  // Rules checks
  try {
    const rules = await loadRules(skillName);
    if (rules.length === 0) errors.push(`${skillName}: no rules found in references/`);

    const groups = groupRulesByPrefix(rules);
    for (const [prefix, prefixRules] of groups) {
      for (const rule of prefixRules) {
        if (!rule.dataset) {
          errors.push(`${skillName}: ${rule.id} missing dataset frontmatter`);
          continue;
        }
        const dsDir = join(SKILLS_DIR, skillName, "dataset", rule.dataset);
        for (const [baseName, extensions] of [["incorrect", [".ts", ".tsx"]], ["correct", [".ts", ".tsx"]], ["notes", [".md"]]]) {
          const found = await Promise.all(extensions.map((ext) => exists(join(dsDir, `${baseName}${ext}`))));
          if (!found.some(Boolean)) {
            const expected = extensions.map((ext) => `${baseName}${ext}`).join(" or ");
            errors.push(`${skillName}: ${rule.id} dataset missing ${rule.dataset}/${expected}`);
          }
        }
      }
    }
  } catch {
    errors.push(`${skillName}: failed to load rules`);
  }

  // Sources checks
  const srcDir = join(skillDir, "sources");
  if (await exists(srcDir)) {
    const sourceFiles = await listFiles(srcDir, ".json");
    if (sourceFiles.length === 0) errors.push(`${skillName}: sources directory must include source metadata`);
  } else {
    errors.push(`${skillName}: sources directory not found`);
  }

  return errors;
}

export async function validate(skillName?: string): Promise<void> {
  const errors: string[] = [];

  // Package.json scripts check
  const packageJson = JSON.parse(await readText(join(ROOT, "package.json"))) as {
    scripts?: Record<string, string>;
  };
  for (const [name, script] of Object.entries(packageJson.scripts ?? {})) {
    if (["build", "validate", "install", "research:index"].includes(name) && !script.startsWith("bun ")) {
      errors.push(`script ${name} must use bun runtime`);
    }
  }

  // Codex plugin checks
  if (await exists(join(ROOT, ".codex-plugin", "plugin.json"))) {
    const plugin = JSON.parse(await readText(join(ROOT, ".codex-plugin", "plugin.json"))) as {
      marketplace?: { supports?: string[] };
    };
    const supported = new Set(plugin.marketplace?.supports ?? []);
    for (const agent of AGENTS) {
      if (!supported.has(agent)) errors.push(`plugin metadata missing support for ${agent}`);
    }
  }

  // Validate skills
  const skills = skillName ? [skillName] : listSkillNames();
  for (const skill of skills) {
    errors.push(...await validateSkill(skill));
  }

  if (errors.length > 0) {
    console.error(errors.map((e) => `- ${e}`).join("\n"));
    throw new Error(`validation failed with ${errors.length} error(s)`);
  }

  const totalRules = skills.length > 0 ? (await loadRules(skills[0])).length : 0;
  console.log(`validated skills=${skills.length} rules=${totalRules} agents=${AGENTS.length}`);
}
