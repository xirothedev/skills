---
title: Prefer Cursor Pagination for Large Lists
impact: HIGH
impactDescription: Avoids unstable pages and expensive large OFFSET scans
tags: pagination, cursor, offset, prisma, postgres
dataset: data/offset-pagination
---

## Prefer Cursor Pagination for Large Lists

Offset pagination is fine for small admin tables, but large public feeds should use a stable cursor with deterministic ordering. PostgreSQL still computes skipped offset rows, and unordered limits produce unstable result subsets.

**Incorrect (large offset feed):**

```typescript
return this.prisma.invoice.findMany({
  skip: page * pageSize,
  take: pageSize,
  orderBy: { createdAt: "desc" },
});
```

**Correct (cursor over stable composite order):**

```typescript
return this.prisma.invoice.findMany({
  take: pageSize,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: [{ createdAt: "desc" }, { id: "desc" }],
});
```

Dataset: `dataset/data/offset-pagination`

Reference:
- https://www.postgresql.org/docs/current/queries-limit.html
- https://www.prisma.io/docs/orm/prisma-client/queries/pagination
