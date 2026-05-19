---
title: Wrap Dependent Writes in One Transaction
impact: CRITICAL
impactDescription: Preserves invariants across multi-table writes
tags: transactions, dependent-writes, consistency, prisma
dataset: data/transaction-boundary
---

## Wrap Dependent Writes in One Transaction

If multiple writes must succeed or fail together, keep them inside one Prisma `$transaction` or a nested write. Do not perform dependent writes as separate awaits from a controller/service path.

**Incorrect (partial failure leaves inconsistent state):**

```typescript
const order = await prisma.order.create({ data: orderData });
await prisma.payment.create({ data: { orderId: order.id, amount } });
await prisma.auditLog.create({ data: { orderId: order.id, action: "created" } });
```

**Correct (single transaction boundary):**

```typescript
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.payment.create({ data: { orderId: order.id, amount } });
  await tx.auditLog.create({ data: { orderId: order.id, action: "created" } });
});
```

Dataset: `dataset/data/transaction-boundary`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
