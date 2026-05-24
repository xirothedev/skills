---
title: Resolve Tenant Identity at the Routing Boundary
impact: HIGH
impactDescription: Prevents tenant bleed across cached pages, rewrites, and shared data access
tags: multi-tenant, hostnames, routing, cache, authorization
dataset: arch/multi-tenant
---

## Resolve Tenant Identity at the Routing Boundary

Multi-tenant apps should derive tenant identity from a trusted hostname/path mapping and pass a canonical tenant id into DAL and cache keys. Do not rely on user-controlled query params.

**Incorrect (tenant from query string):**

```typescript
const tenant = searchParams.tenant;
```

**Correct (tenant from trusted request host):**

```typescript
const tenant = await resolveTenantFromHost(headers().get("host"));
```

## Source References

- https://nextjs.org/docs/app/guides/multi-tenant
- https://nextjs.org/docs/app/guides/data-security
