import { join } from "node:path";
import { ROOT, listSkillNames } from "./paths";
import { readdir, readFile } from "node:fs/promises";
import { buildAll } from "./build";
import { validate } from "./validate";

type Snapshot = Map<string, string>;

export async function syncGenerated(options: { check: boolean; skill?: string }): Promise<void> {
  const skills = options.skill ? [options.skill] : listSkillNames();
  for (const skill of skills) {
    const before = options.check ? await snapshotGenerated(skill) : new Map<string, string>();
    await buildAll(skill);
    await validate(skill);

    if (!options.check) {
      console.log(`synced ${skill}: generated artifacts`);
      continue;
    }

    const after = await snapshotGenerated(skill);
    const changed = diffSnapshots(before, after);
    if (changed.length > 0) {
      console.error(changed.map((path) => `generated artifact changed: ${path}`).join("\n"));
      throw new Error(`${skill}: generated artifacts were stale; run \`bun run sync\``);
    }

    console.log(`${skill}: generated artifacts are in sync`);
  }
}

async function snapshotGenerated(skillName: string): Promise<Snapshot> {
  const snapshot: Snapshot = new Map();
  const paths = [
    join(ROOT, "skills", skillName, "AGENTS.md"),
    join(ROOT, "skills", skillName, "test-cases.json"),
    join(ROOT, "dist", "adapters"),
  ];
  for (const p of paths) {
    await snapshotPath(p, snapshot);
  }
  return snapshot;
}

async function snapshotPath(path: string, snapshot: Snapshot): Promise<void> {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
      await snapshotPath(join(path, entry.name), snapshot);
    }
  } catch {
    const content = await readFile(path, "utf8").catch(() => "");
    snapshot.set(path, content);
  }
}

function diffSnapshots(before: Snapshot, after: Snapshot): string[] {
  const paths = new Set([...before.keys(), ...after.keys()]);
  const changed: string[] = [];
  for (const path of [...paths].sort()) {
    if (before.get(path) !== after.get(path)) changed.push(path);
  }
  return changed;
}
