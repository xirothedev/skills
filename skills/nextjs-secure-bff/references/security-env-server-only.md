---
title: Keep Secrets Behind Server-only Modules
impact: CRITICAL
impactDescription: Prevents environment and privileged SDK access from leaking into client bundles
tags: environment, server-only, secrets, client-boundary
dataset: security/env-server-only
---

## Keep Secrets Behind Server-only Modules

Only modules that run on the server should read private environment variables or instantiate privileged SDK clients. Mark those modules with `server-only` and pass safe DTOs outward.

**Incorrect (shared module reads a secret):**

```typescript
export const adminClient = createClient(process.env.ADMIN_API_KEY!);
```

**Correct (server-only boundary):**

```typescript
import "server-only";

export function getAdminClient() {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error("ADMIN_API_KEY is not configured");
  return createClient(key);
}
```

## Source References

- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/guides/environment-variables
