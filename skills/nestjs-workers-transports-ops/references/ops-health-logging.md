---
title: Expose Health and Structured Logs for Workers
impact: HIGH
impactDescription: Makes queue, transport, cache, and dependency failures observable before users report them
tags: health-checks, logger, terminus, observability, workers
dataset: ops/health-logging
---

## Expose Health and Structured Logs for Workers

Worker-heavy NestJS apps still need health checks, structured logs, and shutdown hooks. Include broker, database, cache, and queue dependency checks where the process depends on them.

**Incorrect (console logs only):**

```typescript
console.log("job failed", error);
```

**Correct (structured logger and health surface):**

```typescript
this.logger.error("job failed", {
  jobId: job.id,
  queue: job.queueName,
  cause: error instanceof Error ? error.message : "unknown",
});
```

## Source References

- https://docs.nestjs.com/techniques/logger
- https://docs.nestjs.com/recipes/terminus
- https://docs.nestjs.com/fundamentals/lifecycle-events
