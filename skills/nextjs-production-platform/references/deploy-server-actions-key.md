---
title: Pin Server Actions Encryption Key Across Instances
impact: CRITICAL
impactDescription: Prevents Server Action closure encryption mismatches after multi-instance deploys
tags: server-actions, self-hosting, encryption-key, multi-instance
dataset: deploy/server-actions-key
---

## Pin Server Actions Encryption Key Across Instances

Self-hosted multi-instance deployments need a shared `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` so Server Actions encrypted by one instance remain valid on another.

**Incorrect (per-instance generated keys):**

```typescript
// No shared key configured for the deployment.
```

**Correct (environment contract):**

```typescript
const required = ["NEXT_SERVER_ACTIONS_ENCRYPTION_KEY"];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}
```

## Source References

- https://nextjs.org/docs/app/guides/self-hosting
- https://nextjs.org/docs/app/guides/data-security
