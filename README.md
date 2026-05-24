# Agent Skills

Standalone multi-skill repository for coding agent best practices. Follows the [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) architecture pattern and ships marketplace-ready skill packs for Codex and Claude Code.

## Available Skills

| Skill | Area | Use When |
| --- | --- | --- |
| `nestjs-best-practices` | NestJS API | Writing, reviewing, refactoring, debugging, or testing NestJS APIs. |
| `nestjs-production-api-contracts` | NestJS contracts | Hardening OpenAPI/Swagger, DTO validation, versioning, public error envelopes, uploads, guards, and policy boundaries. |
| `nestjs-workers-transports-ops` | NestJS ops | Designing queues, workers, schedulers, transports, retries, idempotency, and operational failure handling. |
| `nextjs-best-practices` | Next.js app | Building or reviewing App Router, Server Components, caching, API routes, bundle, and security behavior. |
| `nextjs-cache-components-runtime` | Next.js runtime | Working with Next.js 16 Cache Components, `use cache`, streaming, runtime choices, and metadata/data boundaries. |
| `nextjs-nestjs-integration` | Full-stack integration | Connecting a Next.js frontend or BFF to a NestJS API through clear ownership, OpenAPI clients, sessions, and server-side fetching. |
| `nextjs-production-platform` | Next.js platform | Shipping production Next.js apps with standalone output, Docker, self-hosting, deployment adapters, env handling, and observability. |
| `nextjs-secure-bff` | Next.js security | Securing Route Handlers, Proxy, Server Actions, webhooks, callbacks, cookies, authorization, and server-only data access. |

## Marketplace Install

Add this repository as a marketplace source, then install the skill pack from that source.

```bash
# Codex
codex plugin marketplace add xirothedev/skills

# Claude Code CLI
claude plugin marketplace add xirothedev/skills --scope user

# Claude Code interactive session
/plugin marketplace add xirothedev/skills

# Skills CLI
npx skills add xirothedev/skills
```

Install one skill, or target specific agents:

```bash
npx skills add xirothedev/skills --skill nextjs-best-practices
npx skills add xirothedev/skills --skill nextjs-best-practices -a codex -a claude-code
npx skills add xirothedev/skills --list
```

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
bun run build -- --skill nextjs-best-practices
bun run validate                 # Validate all skills
bun run validate -- --skill nestjs-best-practices
bun run sync                     # Regenerate and validate artifacts
bun run sync -- --check          # Fail if artifacts are stale
bun run check                    # Validate, build, and fail if sync output is stale
bun run list                     # List available skills
bun run install -- --agent all --target /path
bun run install -- --agent claude-code --target /path --skill nextjs-best-practices
```

## Installation

Install from a local checkout into any project for a specific coding agent:

```bash
bun run install -- --agent codex --target /path/to/project
bun run install -- --agent claude --target /path/to/project
bun run install -- --agent cursor --target /path/to/project
bun run install -- --agent all --target /path/to/project --force
```

Supported agents: `codex`, `claude`, `claude-code`, `cursor`, `windsurf`, `gemini`, `copilot`, `cline`, `roo`, `continue`, `aider`, `opencode`
