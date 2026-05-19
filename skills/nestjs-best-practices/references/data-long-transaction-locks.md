---
title: Keep Transactions Short and Lock Order Consistent
impact: HIGH
impactDescription: Reduces lock waits, deadlocks, and stuck API requests
tags: transactions, locks, deadlocks, postgres, concurrency
dataset: data/long-transaction-locks
---

## Keep Transactions Short and Lock Order Consistent

Do not hold database transactions open while waiting on HTTP calls, user input, queues, or slow CPU work. When updating multiple rows/resources, acquire locks in a consistent order and retry known transient deadlock failures.

**Incorrect (external work inside transaction):**

```typescript
await prisma.$transaction(async (tx) => {
  const invoice = await tx.invoice.update({ where: { id }, data: { status: "processing" } });
  await paymentGateway.charge(invoice.total);
  await tx.invoice.update({ where: { id }, data: { status: "paid" } });
});
```

**Correct (short DB transaction, external work outside):**

```typescript
const invoice = await prisma.invoice.update({ where: { id }, data: { status: "processing" } });
await paymentGateway.charge(invoice.total);
await prisma.invoice.update({ where: { id }, data: { status: "paid" } });
```

Dataset: `dataset/data/long-transaction-locks`

Reference:
- https://www.postgresql.org/docs/current/explicit-locking.html
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
