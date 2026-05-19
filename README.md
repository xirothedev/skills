# NestJS Best Practices

Standalone agent skill repository for high-priority NestJS API guidance.

The canonical skill lives in `skills/nestjs-best-practices`. Scripts use Bun
and TypeScript only.

## Commands

```bash
bun run validate
bun run build
bun run extract-tests
bun run sync
bun run sync:check
bun run dev
bun run install -- --agent cursor --target /path/to/project --dry-run
bun run install -- --agent all --target /path/to/project --dry-run
```

Installers never overwrite existing files unless `--force` is provided. Use
`--backup` with `--force` to preserve replaced files.

## Marketplace and Plugins

This repository can be shared as a marketplace root for Claude Code and Codex:

| Field | Value |
|-------|-------|
| GitHub owner | `xirothedev` |
| Repository | `https://github.com/xirothedev/skills` |
| Skill path | `skills/nestjs-best-practices` |
| Issues | `https://github.com/xirothedev/skills/issues` |
| Pull requests | `https://github.com/xirothedev/skills/pulls` |

```bash
# Claude Code, from GitHub
claude plugin marketplace add xirothedev/skills --scope user
claude plugin install nestjs-best-practices@nestjs-best-practices --scope user

# Claude Code, from a local checkout
claude plugin marketplace add /path/to/nestjs-best-practices --scope user
claude plugin install nestjs-best-practices@nestjs-best-practices --scope user

# Codex, from GitHub
codex plugin marketplace add xirothedev/skills

# Codex, from a local checkout
codex plugin marketplace add /path/to/nestjs-best-practices
```

Codex currently exposes marketplace add/remove commands, while Claude Code also
exposes an explicit plugin install command. The plugin manifests live in
`.codex-plugin/plugin.json` and `.claude-plugin/`.

For dedicated Prisma guidance, do not vendor the Prisma skill files into this
shared NestJS skill. Use `$find-skills` to install the Prisma skill pack from
the Skills Library.

## Structure

- `skills/nestjs-best-practices/references/` - individual rule files.
- `skills/nestjs-best-practices/dataset/` - incorrect/correct TypeScript cases.
- `skills/nestjs-best-practices/AGENTS.md` - generated navigation.
- `skills/nestjs-best-practices/test-cases.json` - generated LLM evaluation cases.
- `dist/adapters/` - generated adapter artifacts for supported coding agents.
- `src/` - Bun + TypeScript build, validate, sync, research, and install code.

## Script Semantics

- `build` regenerates `AGENTS.md`, `test-cases.json`, and adapter artifacts.
- `validate` checks rule frontmatter, section coverage, dataset links, source metadata, and marketplace agent support.
- `extract-tests` regenerates only `test-cases.json`.
- `sync` regenerates generated artifacts and validates the result.
- `sync:check` fails if generated artifacts are stale.
- `dev` runs build then validate.
