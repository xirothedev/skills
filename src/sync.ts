import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { buildAll } from "./build";
import { ROOT } from "./paths";
import { validate } from "./validate";

type Snapshot = Map<string, string>;

const GENERATED_PATHS = [
  "skills/nestjs-best-practices/AGENTS.md",
  "skills/nestjs-best-practices/test-cases.json",
  "dist",
];

export async function syncGenerated(options: { check: boolean }): Promise<void> {
  const before = options.check ? await snapshotGenerated() : new Map<string, string>();
  await buildAll();
  await validate();

  if (!options.check) {
    console.log("synced generated artifacts");
    return;
  }

  const after = await snapshotGenerated();
  const changed = diffSnapshots(before, after);
  if (changed.length > 0) {
    console.error(changed.map((path) => `generated artifact changed: ${path}`).join("\n"));
    throw new Error("generated artifacts were stale; run `bun run sync`");
  }

  console.log("generated artifacts are in sync");
}

async function snapshotGenerated(): Promise<Snapshot> {
  const snapshot: Snapshot = new Map();
  for (const generatedPath of GENERATED_PATHS) {
    await snapshotPath(join(ROOT, generatedPath), snapshot);
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
    snapshot.set(relative(ROOT, path), content);
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
