#!/usr/bin/env bun
import { buildAll } from "./build";
import { writeTestCases } from "./build/test-cases";
import { install } from "./installers/install";
import { parseAgent } from "./installers/targets";
import { writeResearchIndex } from "./research";
import { syncGenerated } from "./sync";
import { validate } from "./validate";

type Args = Record<string, string | boolean>;

const [command = "help", ...rest] = Bun.argv.slice(2);

try {
  if (command === "build") {
    await buildAll();
    console.log("built AGENTS.md and adapter artifacts");
  } else if (command === "validate") {
    await validate();
  } else if (command === "extract-tests") {
    await writeTestCases();
    console.log("extracted skills/nestjs-best-practices/test-cases.json");
  } else if (command === "sync") {
    const args = parseArgs(rest);
    await syncGenerated({ check: Boolean(args.check ?? false) });
  } else if (command === "install") {
    const args = parseArgs(rest);
    const agent = parseAgent(String(args.agent ?? "codex"));
    await install({
      agent,
      target: String(args.target ?? process.cwd()),
      dryRun: Boolean(args["dry-run"] ?? args.dryRun ?? false),
      force: Boolean(args.force ?? false),
      backup: Boolean(args.backup ?? false),
    });
  } else if (command === "research:index") {
    await writeResearchIndex();
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
  bun run validate
  bun run extract-tests
  bun run sync
  bun run sync -- --check
  bun run install -- --agent codex --target /path --dry-run
  bun run install -- --agent all --target /path --force --backup
  bun run research:index
`);
}
