---
title: Protect Scheduled Jobs in Multi-instance Deployments
impact: CRITICAL
impactDescription: Prevents every replica from running the same cron side effect
tags: scheduling, cron, locks, multi-instance, workers
dataset: ops/scheduler-locks
---

## Protect Scheduled Jobs in Multi-instance Deployments

`@Cron` runs in every application instance. Use a single worker deployment, distributed locks, or leader election when the job performs side effects.

**Incorrect (every replica sends billing):**

```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async billCustomers() {
  await this.billing.run();
}
```

**Correct (lock before side effects):**

```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async billCustomers() {
  await this.lock.runOnce("billing:daily", () => this.billing.run());
}
```

## Source References

- https://docs.nestjs.com/techniques/task-scheduling
