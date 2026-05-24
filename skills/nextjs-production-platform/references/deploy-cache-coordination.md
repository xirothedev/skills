---
title: Coordinate Cache Tags Across Instances
impact: CRITICAL
impactDescription: Prevents one node from serving stale data after another node revalidates it
tags: cache, self-hosting, multi-instance, revalidation, cache-handler
dataset: deploy/cache-coordination
---

## Coordinate Cache Tags Across Instances

Multi-instance App Router deployments need cache storage and tag invalidation that are shared or coordinated across instances. Local filesystem or process memory is not enough for consistent revalidation.

**Incorrect (local-only cache assumptions):**

```typescript
// Each instance has an isolated in-memory cache and tag state.
```

**Correct (shared cache handler contract):**

```typescript
const nextConfig = {
  cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0,
};
```

## Source References

- https://nextjs.org/docs/app/guides/self-hosting
- https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath
