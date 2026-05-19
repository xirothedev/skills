---
title: Select API Fields Intentionally
impact: HIGH
impactDescription: Reduces payload size, accidental data exposure, and avoidable DB/client work
tags: prisma, select, include, overfetching, api-contract
dataset: data/overfetch-select
---

## Select API Fields Intentionally

Do not return full database records from NestJS services by default. Use Prisma `select` and nested `select` to match the API contract, especially around secrets, large JSON fields, and relations.

**Incorrect (returns database shape):**

```typescript
return this.prisma.user.findUnique({ where: { id } });
```

**Correct (returns API shape):**

```typescript
return this.prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    profile: { select: { displayName: true, avatarUrl: true } },
  },
});
```

Dataset: `dataset/data/overfetch-select`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/select-fields
- https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries
