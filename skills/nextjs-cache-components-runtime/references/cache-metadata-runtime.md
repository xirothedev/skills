---
title: Make Metadata Runtime Access Explicit
impact: HIGH
impactDescription: Prevents metadata or viewport from silently forcing blocking runtime rendering
tags: metadata, viewport, runtime-data, cache-components
dataset: cache/metadata-runtime
---

## Make Metadata Runtime Access Explicit

`generateMetadata` and `generateViewport` are tracked separately from the page. If they access runtime or uncached data, either cache that data or explicitly defer to request time.

**Incorrect (uncached metadata read):**

```typescript
export async function generateMetadata({ params }: PageProps) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return { title: product?.name };
}
```

**Correct (cached metadata source):**

```typescript
async function getProductMetadata(id: string) {
  "use cache";
  cacheLife("hours");
  return db.product.findUnique({ where: { id }, select: { name: true } });
}
```

## Source References

- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
