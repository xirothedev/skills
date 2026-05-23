import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILLS_DIR = join(ROOT, "skills");
export const SKILL_DIR = join(SKILLS_DIR, "nestjs-best-practices");
export const DIST_DIR = join(ROOT, "dist");
export const ADAPTERS_DIR = join(DIST_DIR, "adapters");

export function skillDir(name: string): string {
  return join(SKILLS_DIR, name);
}

export function referencesDir(name: string): string {
  return join(skillDir(name), "references");
}

export function datasetDir(name: string): string {
  return join(skillDir(name), "dataset");
}

export function sourcesDir(name: string): string {
  return join(skillDir(name), "sources");
}

export function listSkillNames(): string[] {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
