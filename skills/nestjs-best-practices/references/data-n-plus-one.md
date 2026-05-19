---
title: Batch Relation Reads to Avoid N+1 Queries
impact: CRITICAL
impactDescription: Collapses 1+N database round trips into one relation query or one batched lookup
tags: prisma, relations, graphql, n-plus-one, performance
dataset: data/n-plus-one
---

## Batch Relation Reads to Avoid N+1 Queries

Fetching related rows inside a loop is the classic API database failure. In NestJS services and GraphQL resolvers, use Prisma `include`/`select`, `relationLoadStrategy: "join"` where appropriate, or a batched `in` query.

**Incorrect (query inside loop):**

```typescript
const users = await prisma.user.findMany();
return Promise.all(users.map(async (user) => ({
  ...user,
  posts: await prisma.post.findMany({ where: { authorId: user.id } }),
})));
```

**Correct (single relation query):**

```typescript
return prisma.user.findMany({
  relationLoadStrategy: "join",
  include: { posts: true },
});
```

Dataset: `dataset/data/n-plus-one`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance
- https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries
