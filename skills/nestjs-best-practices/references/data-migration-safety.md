---
title: Separate Development Push from Production Migrations
impact: CRITICAL
impactDescription: Prevents accidental schema drift and destructive production changes
tags: migrations, prisma, production, schema-drift, deploy
dataset: data/migration-safety
---

## Separate Development Push from Production Migrations

`db push` is useful for prototyping, but production should use reviewed migrations and `migrate deploy`. Never hide schema changes in NestJS app startup.

**Incorrect (app startup mutates schema):**

```typescript
await execa("bun", ["prisma", "db", "push"]);
await app.listen(3000);
```

**Correct (CI/deploy runs migrations before app starts):**

```bash
bun prisma migrate deploy
bun prisma generate
bun dist/main.js
```

Dataset: `dataset/data/migration-safety`

Reference:
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
- https://www.prisma.io/docs/orm/reference/prisma-cli-reference
