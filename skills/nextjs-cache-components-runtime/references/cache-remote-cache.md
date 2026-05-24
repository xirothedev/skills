---
title: Use Remote Cache for Durable Shared Runtime Cache
impact: HIGH
impactDescription: Prevents serverless or multi-instance deployments from losing cache consistency
tags: use-cache-remote, self-hosting, serverless, cache-handlers
dataset: cache/remote-cache
---

## Use Remote Cache for Durable Shared Runtime Cache

In-memory cache entries may disappear between requests in serverless deployments and diverge across multiple instances. Use `use cache: remote` or a platform cache handler when data must be shared durably.

**Incorrect (assumes instance memory is durable):**

```typescript
async function getReport() {
  "use cache";
  cacheLife("hours");
  return buildExpensiveReport();
}
```

**Correct (remote cache for shared result):**

```typescript
async function getReport() {
  "use cache: remote";
  cacheLife("hours");
  return buildExpensiveReport();
}
```

## Source References

- https://nextjs.org/docs/app/api-reference/directives/use-cache-remote
- https://nextjs.org/docs/app/guides/self-hosting
