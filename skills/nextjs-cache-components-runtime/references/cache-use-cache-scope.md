---
title: Put `use cache` at the Narrowest Stable Boundary
impact: CRITICAL
impactDescription: Prevents personalized or volatile request data from being cached too broadly
tags: use-cache, cache-life, ppr, data-cache
dataset: cache/use-cache-scope
---

## Put `use cache` at the Narrowest Stable Boundary

Cache deterministic data or UI that can be shared for the chosen lifetime. Avoid wrapping whole pages when only one expensive read should be cached.

**Incorrect (page-level cache captures mixed concerns):**

```typescript
export default async function Dashboard() {
  "use cache";
  const user = await getCurrentUser();
  const stats = await getExpensiveStats();
  return <DashboardView user={user} stats={stats} />;
}
```

**Correct (cache only stable computation):**

```typescript
async function getExpensiveStats() {
  "use cache";
  cacheLife("hours");
  return db.stats.findMany();
}
```

## Source References

- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/api-reference/directives/use-cache
