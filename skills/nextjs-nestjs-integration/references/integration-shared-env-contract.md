---
title: Split Public, Server-only, and Backend Env Contracts
impact: HIGH
impactDescription: Prevents browser-exposed variables from being used as backend secrets or internal service URLs
tags: environment, monorepo, secrets, next-public, runtime-config
dataset: integration/shared-env-contract
---

## Split Public, Server-only, and Backend Env Contracts

Next.js and NestJS often share a repo but not an environment boundary. Keep `NEXT_PUBLIC_*` browser values, Next.js server-only values, and NestJS backend secrets separate and validated per app.

**Incorrect (public API secret):**

```typescript
NEXT_PUBLIC_API_SECRET="secret"
```

**Correct (separate contracts):**

```typescript
NEXT_PUBLIC_APP_URL="https://app.example.com"
NEXT_SERVER_API_ORIGIN="http://api:3000"
API_JWT_SECRET="server-only"
```

## Source References

- https://nextjs.org/docs/app/guides/environment-variables
- https://docs.nestjs.com/techniques/configuration
