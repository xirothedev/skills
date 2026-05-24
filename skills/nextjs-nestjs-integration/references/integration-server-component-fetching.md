---
title: Server Components Should Fetch Backend Data Directly
impact: HIGH
impactDescription: Avoids build-time self-fetch failures and unnecessary HTTP round trips through the same Next.js app
tags: server-components, route-handlers, bff, data-fetching
dataset: integration/server-component-fetching
---

## Server Components Should Fetch Backend Data Directly

Server Components should call the NestJS API or server-only DAL/client directly. Do not fetch the Next.js app's own Route Handlers from Server Components.

**Incorrect (self-fetches a Route Handler):**

```typescript
const res = await fetch(`${APP_URL}/api/products`);
```

**Correct (backend client or DAL):**

```typescript
const products = await api.products.list();
```

## Source References

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/getting-started/fetching-data
