#!/usr/bin/env bun
import { buildAll } from "./build";
import { install } from "./installers/install";
import { parseAgent } from "./installers/targets";
import { syncGenerated } from "./sync";
import { validate } from "./validate";
import { listSkillNames } from "./paths";

type Args = Record<string, string | boolean>;

const [command = "help", ...rest] = Bun.argv.slice(2);

try {
  if (command === "build") {
    const args = parseArgs(rest);
    if (args.skill && typeof args.skill === "string") {
      await buildAll(args.skill);
      console.log(`built ${args.skill}: AGENTS.md and adapter artifacts`);
    } else {
      for (const skill of listSkillNames()) {
        await buildAll(skill);
        console.log(`built ${skill}: AGENTS.md and adapter artifacts`);
      }
    }
  } else if (command === "validate") {
    const args = parseArgs(rest);
    const skill = typeof args.skill === "string" ? args.skill : undefined;
    await validate(skill);
  } else if (command === "sync") {
    const args = parseArgs(rest);
    const skill = typeof args.skill === "string" ? args.skill : undefined;
    await syncGenerated({ check: Boolean(args.check ?? false), skill });
  } else if (command === "install") {
    const args = parseArgs(rest);
    const agent = parseAgent(String(args.agent ?? "codex"));
    const skill = typeof args.skill === "string" ? args.skill : undefined;
    await install({
      agent,
      target: String(args.target ?? process.cwd()),
      dryRun: Boolean(args["dry-run"] ?? args.dryRun ?? false),
      force: Boolean(args.force ?? false),
      backup: Boolean(args.backup ?? false),
      skill,
    });
  } else if (command === "list") {
    const skills = listSkillNames();
    console.log(`available skills: ${skills.join(", ")}`);
  } else {
    printHelp();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}

function parseArgs(args: string[]): Args {
  const parsed: Args = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function printHelp(): void {
  console.log(`Usage:
  bun run build
  bun run build -- --all
  bun run build -- --skill nextjs-best-practices
  bun run validate
  bun run validate -- --skill nestjs-best-practices
  bun run sync
  bun run sync -- --check
  bun run install -- --agent codex --target /path --dry-run
  bun run install -- --agent all --target /path --force --backup
  bun run list
`);
}
