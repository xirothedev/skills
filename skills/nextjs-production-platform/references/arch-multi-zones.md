---
title: Isolate Static Assets and Routing in Multi-Zones
impact: HIGH
impactDescription: Prevents micro-frontend zones from serving each other's assets or intercepting wrong paths
tags: multi-zones, rewrites, assetPrefix, micro-frontends
dataset: arch/multi-zones
---

## Isolate Static Assets and Routing in Multi-Zones

Each zone should own a path set and avoid `_next/static` collisions. Use `assetPrefix` and explicit rewrites/proxy routing for assets and application paths.

**Incorrect (two zones share asset paths):**

```typescript
const nextConfig = {};
```

**Correct (zone-specific asset prefix):**

```typescript
const nextConfig = {
  assetPrefix: "/dashboard-static",
};
```

## Source References

- https://nextjs.org/docs/app/guides/multi-zones
