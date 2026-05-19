---
title: Keep GraphQL Resolvers Thin
impact: MEDIUM
impactDescription: Preserves service reuse across REST, GraphQL, jobs, and tests
tags: graphql, resolvers, services, transport
dataset: transport/graphql-resolver
---

## Keep GraphQL Resolvers Thin

Resolvers are transport adapters. They should translate GraphQL args and delegate to services instead of embedding persistence or business rules.

**Incorrect (resolver owns business logic):**

```typescript
@Mutation(() => User)
createUser(@Args("input") input: CreateUserInput) {
  return this.prisma.user.create({ data: input });
}
```

**Correct (resolver delegates):**

```typescript
@Mutation(() => User)
createUser(@Args("input") input: CreateUserInput) {
  return this.usersService.create(input);
}
```

Dataset: `dataset/transport/graphql-resolver`

Reference:
- https://docs.nestjs.com/graphql/resolvers
- https://github.com/nestjs/nest/tree/v11.1.16/sample/31-graphql-federation-code-first
