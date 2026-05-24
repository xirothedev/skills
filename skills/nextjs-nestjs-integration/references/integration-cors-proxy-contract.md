---
title: Define One Browser Boundary for CORS and Proxying
impact: CRITICAL
impactDescription: Prevents cookie, preflight, and origin behavior from changing between local and production
tags: cors, proxy, cookies, rewrites, origins
dataset: integration/cors-proxy-contract
---

## Define One Browser Boundary for CORS and Proxying

Choose whether browsers call NestJS directly or only call Next.js. Configure CORS, cookies, rewrites, and Proxy around that decision instead of mixing both paths casually.

**Incorrect (mixed browser paths):**

```typescript
fetch("/api/users");
fetch("https://api.example.com/users");
```

**Correct (single public browser boundary):**

```typescript
fetch("/api/users");
```

## Source References

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://docs.nestjs.com/security/cors
