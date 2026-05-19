---
title: Guard Read-Modify-Write Updates
impact: CRITICAL
impactDescription: Prevents lost updates when concurrent requests modify the same row
tags: optimistic-concurrency, lost-update, transactions, isolation, prisma, postgres
dataset: data/optimistic-concurrency
---

## Guard Read-Modify-Write Updates

A transaction is not automatically exclusive access. For read-modify-write flows, use atomic updates, row locks where appropriate, or optimistic concurrency with a `version`/`updatedAt` predicate and retry behavior.

**Incorrect (last writer silently wins):**

```typescript
const account = await this.prisma.account.findUniqueOrThrow({ where: { id } });

return this.prisma.account.update({
  where: { id },
  data: { balance: account.balance - amount },
});
```

**Correct (version predicate detects contention):**

```typescript
const account = await this.prisma.account.findUniqueOrThrow({ where: { id } });

const updated = await this.prisma.account.updateMany({
  where: { id, version: account.version },
  data: {
    balance: { decrement: amount },
    version: { increment: 1 },
  },
});

if (updated.count !== 1) throw new ConflictException("Account changed; retry");
```

Dataset: `dataset/data/optimistic-concurrency`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- https://www.postgresql.org/docs/current/transaction-iso.html
- https://www.postgresql.org/docs/current/explicit-locking.html
