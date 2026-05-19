---
title: Enforce Invariants with Database Constraints
impact: CRITICAL
impactDescription: Prevents duplicate, orphaned, and impossible rows when app code has bugs or races
tags: constraints, uniqueness, foreign-keys, referential-integrity, prisma-schema, postgres
dataset: data/constraint-integrity
---

## Enforce Invariants with Database Constraints

Do not rely only on DTO validation or service checks for facts the database must always preserve. Encode uniqueness, required ownership, referential integrity, and simple state invariants in the schema with `@unique`, `@@unique`, relations, foreign keys, and check constraints where supported.

**Incorrect (application-only invariants):**

```prisma
model User {
  id    String @id @default(cuid())
  email String
}

model Invoice {
  id     String @id @default(cuid())
  userId String
}
```

**Correct (database rejects invalid state):**

```prisma
model User {
  id       String    @id @default(cuid())
  email    String    @unique
  invoices Invoice[]
}

model Invoice {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Restrict)
}
```

Dataset: `dataset/data/constraint-integrity`

Reference:
- https://www.postgresql.org/docs/current/ddl-constraints.html
- https://www.prisma.io/docs/orm/prisma-schema/data-model/models
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
