# Agent Skills

Standalone multi-skill repository for coding agent best practices. Follows the [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) architecture pattern.

## Available Skills

- **nestjs-best-practices** — NestJS API guidance (22 rules, 19 database failure patterns)
- **nextjs-best-practices** — Next.js full-stack guide (28 rules, App Router focused)

## Structure

```
skills/{name}/          # Each skill directory
  SKILL.md              # Agent instructions with frontmatter
  AGENTS.md             # Generated navigation (do not edit)
  metadata.json         # Skill metadata (version, framework, references)
  references/           # Rule files (one per pattern)
  dataset/              # Incorrect/correct code examples
  sources/              # Source metadata for research
  test-cases.json       # Generated LLM evaluation cases
packages/skill-build/   # Shared build tooling
src/                    # CLI, validation, sync, installers
dist/adapters/          # Generated adapter artifacts (12 agents)
.claude/skills/         # Claude Code marketplace registry
.codex-plugin/          # Codex marketplace plugin metadata
```

## Commands

```bash
bun run build                    # Build all skills
bun run build -- --skill nextjs  # Build single skill
bun run validate                 # Validate all skills
bun run validate -- --skill nestjs
bun run sync                     # Regenerate and validate artifacts
bun run sync -- --check          # Fail if artifacts are stale
bun run list                     # List available skills
bun run install -- --agent all --target /path
bun run install -- --agent claude-code --target /path --skill nextjs
```

## Installation

Install skill into any project for a specific coding agent:

```bash
bun run install -- --agent codex --target /path/to/project
bun run install -- --agent claude --target /path/to/project
bun run install -- --agent cursor --target /path/to/project
bun run install -- --agent all --target /path/to/project --force
```

Supported agents: `codex`, `claude`, `claude-code`, `cursor`, `windsurf`, `gemini`, `copilot`, `cline`, `roo`, `continue`, `aider`, `opencode`
