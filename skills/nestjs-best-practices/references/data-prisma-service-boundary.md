---
title: Keep ORM Access Behind Feature Services
impact: HIGH
impactDescription: Preserves domain boundaries and makes transactions auditable
tags: prisma, typeorm, services, transactions, repository-boundary
dataset: data/prisma-boundary
---

## Keep ORM Access Behind Feature Services

Controllers and guards should not call Prisma or TypeORM repositories directly. Keep data access in injectable services so validation, authorization, and transactions remain explicit.

**Incorrect (controller owns ORM query):**

```typescript
@Get(":id")
findOne(@Param("id") id: string) {
  return this.prisma.user.findUnique({ where: { id } });
}
```

**Correct (service owns persistence detail):**

```typescript
@Get(":id")
findOne(@Param("id") id: string) {
  return this.usersService.findOne(id);
}
```

Dataset: `dataset/data/prisma-boundary`

Reference:
- https://docs.nestjs.com/recipes/prisma
- https://docs.nestjs.com/techniques/database
