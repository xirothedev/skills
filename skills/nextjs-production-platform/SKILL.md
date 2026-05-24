---
name: nextjs-production-platform
description: Use for production Next.js platform work involving Docker or standalone output, static export tradeoffs, self-hosting, deployment adapters, Server Actions encryption keys, shared cache coordination, OpenTelemetry instrumentation, multi-zones, multi-tenant routing, or platform capability reviews.
metadata:
  author: xiro
  version: "0.1.0"
  organization: local
  date: May 2026
  framework: Next.js
  frameworkVersion: "v16.2.6"
  supportedVersions:
    - "15.x.x"
    - "16.x.x"
  priority: high
  abstract: Production platform skill for deploying and operating Next.js applications across Docker, standalone Node runtime, self-hosted multi-instance setups, observability, multi-zone, and multi-tenant architectures.
---

# Next.js Production Platform

Use this skill when a Next.js task touches runtime packaging, hosting topology, observability, cache coordination, or domain routing. Verify platform capabilities before choosing a rendering, cache, or deployment mode.

## When to Apply

Use this skill when:
- Writing or reviewing Dockerfiles, standalone output, static export, or deployment workflow changes
- Self-hosting Next.js across multiple instances or regions
- Configuring shared cache handlers, deployment IDs, or Server Action encryption keys
- Adding `instrumentation.ts`, OpenTelemetry, Speed Insights, or production logging
- Splitting apps with Multi-Zones or designing tenant routing
- Choosing whether a platform supports streaming, PPR, ISR, route handlers, or WebSockets

## Load On Demand

Start with this file. Load detailed files only when the task needs them:

```
references/_sections.md
references/deploy-standalone-docker.md
references/deploy-server-actions-key.md
references/deploy-cache-coordination.md
references/ops-instrumentation.md
references/arch-multi-zones.md
references/arch-multi-tenant.md
dataset/deploy/standalone-docker/correct.ts
sources/inventory.json
```

Each rule file includes:
- Why the pattern matters
- Incorrect and correct examples
- Dataset path with larger examples
- Official source references

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Deployment & Runtime | CRITICAL | `deploy-` |
| 2 | Architecture & Routing Topology | HIGH | `arch-` |
| 3 | Operations & Observability | HIGH | `ops-` |

## Source Policy

Prefer official Next.js deployment, self-hosting, adapter, and platform docs. Verify host-specific behavior from the host documentation before assuming support for streaming, PPR, shared cache, or long-running connections.
