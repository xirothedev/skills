import { cp, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { ADAPTERS_DIR, SKILL_DIR } from "../paths";
import { buildAll } from "../build";
import { copyFileEnsuringDir, exists } from "../fs-utils";
import { AGENTS, AgentName, INSTALL_TARGETS } from "./targets";

export type InstallOptions = {
  agent: AgentName | "all";
  target: string;
  dryRun: boolean;
  force: boolean;
  backup: boolean;
};

type PlannedWrite = {
  source: string;
  target: string;
  kind: "file" | "directory";
};

export async function install(options: InstallOptions): Promise<void> {
  await buildAll();
  const agents = options.agent === "all" ? [...AGENTS] : [options.agent];
  const writes: PlannedWrite[] = [];

  for (const agent of agents) {
    const target = INSTALL_TARGETS[agent];
    for (const file of target.files) {
      writes.push({
        source: join(ADAPTERS_DIR, file.from),
        target: resolve(options.target, file.to),
        kind: "file",
      });
    }
    if (target.skillCopy) {
      writes.push({
        source: SKILL_DIR,
        target: resolve(options.target, target.skillCopy.to),
        kind: "directory",
      });
    }
  }
  if (agents.some((agent) => agent !== "codex" && agent !== "claude")) {
    writes.push({
      source: SKILL_DIR,
      target: resolve(options.target, ".agent-skills", "nestjs-best-practices"),
      kind: "directory",
    });
  }

  await printPlan(writes, options);
  if (options.dryRun) return;

  for (const write of writes) {
    const targetExists = await exists(write.target);
    if (targetExists && !options.force) {
      throw new Error(`Refusing to overwrite ${write.target}. Re-run with --force or choose another target.`);
    }
    if (targetExists && options.backup) {
      await backupPath(write.target);
    }
    if (write.kind === "directory") {
      await mkdir(dirname(write.target), { recursive: true });
      await cp(write.source, write.target, { recursive: true, force: true });
    } else {
      await copyFileEnsuringDir(write.source, write.target);
    }
  }
}

async function printPlan(writes: PlannedWrite[], options: InstallOptions): Promise<void> {
  console.log(`target=${resolve(options.target)}`);
  console.log(`agent=${options.agent}`);
  console.log(`dryRun=${options.dryRun}`);
  console.log(`force=${options.force}`);
  for (const write of writes) {
    const targetExists = await exists(write.target);
    const action = targetExists ? (options.force ? "overwrite" : "blocked") : "create";
    console.log(`${action} ${write.kind} ${relative(resolve(options.target), write.target)}`);
    if (targetExists && write.kind === "file") {
      await printTinyDiff(write.source, write.target);
    }
  }
}

async function printTinyDiff(source: string, target: string): Promise<void> {
  const [next, current] = await Promise.all([readFile(source, "utf8"), readFile(target, "utf8")]);
  if (next === current) {
    console.log("  unchanged");
    return;
  }
  const nextLines = next.split("\n").length;
  const currentLines = current.split("\n").length;
  console.log(`  changed lines current=${currentLines} next=${nextLines}`);
}

async function backupPath(path: string): Promise<void> {
  const suffix = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `${path}.backup-${suffix}`;
  const info = await stat(path);
  if (info.isDirectory()) {
    await mkdir(dirname(backup), { recursive: true });
    await cp(path, backup, { recursive: true, force: true });
  } else {
    await mkdir(dirname(backup), { recursive: true });
    await writeFile(backup, await readFile(path));
  }
}
