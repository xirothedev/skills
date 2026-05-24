---
title: Make Queue Jobs Idempotent and Retry-safe
impact: CRITICAL
impactDescription: Prevents duplicate side effects when jobs retry, redeliver, or run concurrently
tags: queues, bull, bullmq, idempotency, retries
dataset: ops/queue-idempotency
---

## Make Queue Jobs Idempotent and Retry-safe

Queue processors should assume at-least-once delivery. Use deterministic job ids, idempotency records, unique constraints, or transaction boundaries before external side effects.

**Incorrect (side effect repeats on retry):**

```typescript
@Process("send-email")
async send(job: Job<EmailJob>) {
  await mailer.send(job.data);
}
```

**Correct (idempotent processor):**

```typescript
@Process("send-email")
async send(job: Job<EmailJob>) {
  if (await this.outbox.wasProcessed(job.id)) return;
  await this.mailer.send(job.data);
  await this.outbox.markProcessed(job.id);
}
```

## Source References

- https://docs.nestjs.com/techniques/queues
