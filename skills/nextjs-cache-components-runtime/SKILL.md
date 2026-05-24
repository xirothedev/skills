---
name: nextjs-cache-components-runtime
description: Use for Next.js 16 Cache Components and runtime rendering work involving `use cache`, `cacheLife`, `cacheTag`, `updateTag`, Suspense, runtime APIs, Partial Prerendering, remote cache, metadata/viewport runtime access, or migration from older route segment caching configs.
metadata:
  author: xiro
  version: "0.1.0"
  organization: local
  date: May 2026
  framework: Next.js
  frameworkVersion: "v16.2.6"
  supportedVersions:
    - "16.x.x"
  priority: high
  abstract: Focused skill for Next.js Cache Components, runtime data, PPR, streaming, tag invalidation, and cache migration decisions.
---

# Next.js Cache Components Runtime

Use this skill when the task changes how a Next.js route is prerendered, streamed, cached, personalized, or invalidated. Make the cache boundary explicit instead of relying on older route-level dynamic/static flags.

## When to Apply

Use this skill when:
- Enabling or debugging `cacheComponents: true`
- Adding `use cache`, `cacheLife`, `cacheTag`, `updateTag`, or `revalidateTag`
- Fixing "uncached data outside Suspense" build/runtime errors
- Moving runtime APIs like `cookies()`, `headers()`, `params`, or `searchParams` through cached functions
- Migrating `dynamic`, `revalidate`, or previous-model caching code to Cache Components
- Designing cache behavior for self-hosted or serverless deployments

## Load On Demand

Start with this file. Load detailed files only when the task needs them:

```
references/_sections.md
references/cache-use-cache-scope.md
references/cache-runtime-suspense.md
references/cache-tag-invalidation.md
references/cache-remote-cache.md
references/cache-metadata-runtime.md
references/cache-migration-segment-configs.md
dataset/cache/use-cache-scope/correct.tsx
sources/inventory.json
```

Each rule file includes:
- Why the pattern matters
- Incorrect and correct examples
- Dataset path with larger TypeScript/TSX examples
- Official source references

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Cache Boundaries | CRITICAL | `cache-` |
| 2 | Data & Runtime Rendering | HIGH | `data-` |
| 3 | Operations & Deployment | HIGH | `ops-` |

## Source Policy

Use official Next.js 16 docs for Cache Components. Do not rely on Next.js 13/14/15 caching advice unless the project has not enabled `cacheComponents`.
