---
title: Add Indexes for Hot Filters and Sorts
impact: CRITICAL
impactDescription: Prevents sequential scans on high-traffic API paths
tags: indexes, postgres, prisma-schema, query-plan, performance
dataset: data/missing-index
---

## Add Indexes for Hot Filters and Sorts

If a NestJS endpoint filters or orders by a column on a growing table, the schema needs an index that matches the query shape. Confirm with `EXPLAIN`/query plans rather than guessing.

**Incorrect (hot query has no matching index):**

```prisma
model Invoice {
  id        String   @id @default(cuid())
  tenantId  String
  status    String
  createdAt DateTime @default(now())
}
```

**Correct (composite index matches tenant/status/date feed):**

```prisma
model Invoice {
  id        String   @id @default(cuid())
  tenantId  String
  status    String
  createdAt DateTime @default(now())

  @@index([tenantId, status, createdAt])
}
```

Dataset: `dataset/data/missing-index`

Reference:
- https://www.postgresql.org/docs/current/indexes.html
- https://www.postgresql.org/docs/current/using-explain.html
- https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes
