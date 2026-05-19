---
title: Bound Every List Query
impact: HIGH
impactDescription: Prevents accidental full-table reads, memory spikes, and slow API responses
tags: pagination, limits, find-many, api-contracts, prisma, postgres
dataset: data/unbounded-result-set
---

## Bound Every List Query

Every public NestJS list endpoint should apply an explicit limit and stable ordering. Treat unbounded `findMany()` calls as bugs unless they are offline jobs with batching and backpressure.

**Incorrect (returns every matching row):**

```typescript
return this.prisma.auditLog.findMany({
  where: { tenantId },
  orderBy: { createdAt: "desc" },
});
```

**Correct (bounded contract):**

```typescript
const take = Math.min(query.limit ?? 50, 100);

return this.prisma.auditLog.findMany({
  where: { tenantId },
  orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  take,
});
```

Dataset: `dataset/data/unbounded-result-set`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/pagination
- https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
- https://www.postgresql.org/docs/current/queries-limit.html
