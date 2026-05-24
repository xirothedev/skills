---
title: Replace Route Segment Cache Flags with Component Boundaries
impact: HIGH
impactDescription: Keeps Next.js 16 caching decisions local to the data or UI that needs them
tags: migration, dynamic, revalidate, route-segment-config, cache-components
dataset: cache/migration-segment-configs
---

## Replace Route Segment Cache Flags with Component Boundaries

When Cache Components are enabled, old route-level flags such as `dynamic = "force-dynamic"` are usually the wrong abstraction. Move the decision to `use cache`, Suspense, `connection()`, or explicit runtime access.

**Incorrect (old route-level control):**

```typescript
export const dynamic = "force-dynamic";
export const revalidate = 60;
```

**Correct (local boundary):**

```typescript
async function ProductList() {
  "use cache";
  cacheLife("minutes");
  return <Products products={await getProducts()} />;
}
```

## Source References

- https://nextjs.org/docs/app/guides/migrating-to-cache-components
- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
