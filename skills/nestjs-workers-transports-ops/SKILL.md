---
name: nestjs-workers-transports-ops
description: Use for NestJS production worker and integration tasks involving microservice transports, hybrid apps, queues, scheduled jobs, cache stores, health checks, structured logging, lifecycle events, shutdown hooks, WebSocket gateways, or non-HTTP Nest runtimes.
metadata:
  author: xiro
  version: "0.1.0"
  organization: local
  date: May 2026
  framework: NestJS
  frameworkVersion: "v11.1.16"
  supportedVersions:
    - "10.x.x"
    - "11.x.x"
  priority: high
  abstract: Focused NestJS skill for production non-HTTP and operational workloads: microservices, hybrid apps, queues, schedules, cache stores, health checks, lifecycle, and structured logging.
---

# NestJS Workers Transports Ops

Use this skill when NestJS runs work outside a plain HTTP controller: message handlers, queue processors, scheduled jobs, gateways, cache-backed flows, or health/observability surfaces.

## When to Apply

Use this skill when:
- Adding or reviewing `@MessagePattern`, Kafka/RabbitMQ/NATS/gRPC transports, or hybrid apps
- Implementing Bull/BullMQ queue producers, processors, retries, or idempotency
- Adding `@Cron`, intervals, scheduler registry jobs, or distributed scheduled tasks
- Configuring cache-manager stores, Redis, or cache invalidation
- Adding health checks, JSON logging, lifecycle hooks, or graceful shutdown
- Debugging why guards/pipes/interceptors differ between HTTP and microservice contexts

## Load On Demand

Start with this file. Load detailed files only when the task needs them:

```
references/_sections.md
references/transport-microservice-errors.md
references/transport-hybrid-config.md
references/ops-queue-idempotency.md
references/ops-scheduler-locks.md
references/ops-cache-store.md
references/ops-health-logging.md
dataset/ops/queue-idempotency/correct.ts
sources/inventory.json
```

Each rule file includes:
- Why the pattern matters
- Incorrect and correct examples
- Dataset path with larger TypeScript examples
- Official source references

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Transports & Integration Patterns | CRITICAL | `transport-` |
| 2 | Operations & Worker Runtime | CRITICAL | `ops-` |
| 3 | Performance & Runtime State | HIGH | `perf-` |

## Source Policy

Prefer official NestJS docs for microservices, queues, scheduling, caching, health checks, logging, and lifecycle semantics. Broker-specific reliability settings must be verified against the chosen broker and queue library docs.
