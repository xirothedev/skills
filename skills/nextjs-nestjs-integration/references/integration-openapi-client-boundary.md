---
title: Generate Clients from NestJS OpenAPI Contracts
impact: CRITICAL
impactDescription: Prevents Next.js fetch wrappers from drifting away from backend DTOs and errors
tags: openapi, generated-client, dto, contracts, monorepo
dataset: integration/openapi-client-boundary
---

## Generate Clients from NestJS OpenAPI Contracts

Next.js should consume the NestJS API through a typed client generated from the published OpenAPI document or a shared contract package. Do not hand-maintain request/response shapes in UI code.

**Incorrect (duplicated shape):**

```typescript
await fetch(`${API_URL}/users`, {
  method: "POST",
  body: JSON.stringify({ fullName: name }),
});
```

**Correct (generated contract client):**

```typescript
await api.users.createUser({
  body: { name },
});
```

## Source References

- https://docs.nestjs.com/openapi/introduction
- https://nextjs.org/docs/app/guides/backend-for-frontend
