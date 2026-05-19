---
title: Avoid Read-Then-Create Races
impact: CRITICAL
impactDescription: Prevents duplicate rows and inconsistent idempotency under concurrent requests
tags: upsert, race-conditions, uniqueness, idempotency, prisma, transactions
dataset: data/race-condition-upsert
---

## Avoid Read-Then-Create Races

Do not implement uniqueness with `findFirst`/`findUnique` followed by `create`. Concurrent requests can both observe absence and then race. Add a database unique constraint and use `upsert`, nested writes, `createMany({ skipDuplicates: true })`, or handle the database uniqueness error intentionally.

**Incorrect (two requests can both create):**

```typescript
const existing = await this.prisma.user.findUnique({ where: { email } });
if (existing) return existing;

return this.prisma.user.create({ data: { email, name } });
```

**Correct (unique constraint plus atomic intent):**

```typescript
return this.prisma.user.upsert({
  where: { email },
  update: { name },
  create: { email, name },
});
```

Dataset: `dataset/data/race-condition-upsert`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/crud
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- https://www.postgresql.org/docs/current/ddl-constraints.html
