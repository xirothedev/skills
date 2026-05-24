---
title: Propagate Session Context Explicitly to NestJS
impact: CRITICAL
impactDescription: Prevents anonymous backend calls or accidental trust in client-controlled headers
tags: auth, session, cookies, bearer-token, headers
dataset: integration/session-propagation
---

## Propagate Session Context Explicitly to NestJS

Server-side Next.js code calling NestJS should derive session context from trusted cookies/session helpers and forward only the backend credential or signed context NestJS expects.

**Incorrect (forwards arbitrary browser headers):**

```typescript
return fetch(API_URL, { headers: await headers() });
```

**Correct (explicit auth header):**

```typescript
const session = await auth();
return api.withToken(session.backendAccessToken).users.me();
```

## Source References

- https://nextjs.org/docs/app/guides/data-security
- https://docs.nestjs.com/guards
