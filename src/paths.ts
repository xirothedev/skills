import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_DIR = join(ROOT, "skills", "nestjs-best-practices");
export const REFERENCES_DIR = join(SKILL_DIR, "references");
export const DATASET_DIR = join(SKILL_DIR, "dataset");
export const SOURCES_DIR = join(SKILL_DIR, "sources");
export const DIST_DIR = join(ROOT, "dist");
export const ADAPTERS_DIR = join(DIST_DIR, "adapters");
