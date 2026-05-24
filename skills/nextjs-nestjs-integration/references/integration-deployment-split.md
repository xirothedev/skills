---
title: Verify Split Deployment Health and Runtime Alignment
impact: HIGH
impactDescription: Prevents frontend deploys from shipping against unavailable or incompatible backend contracts
tags: deployment, health-checks, openapi, docker, ci
dataset: integration/deployment-split
---

## Verify Split Deployment Health and Runtime Alignment

When Next.js and NestJS deploy separately, CI and release checks should verify backend health, OpenAPI compatibility, runtime env, and the generated client before the frontend ships.

**Incorrect (frontend deploy ignores API state):**

```typescript
await deployWeb();
```

**Correct (contract and health gate):**

```typescript
await verifyApiHealth();
await verifyOpenApiClientIsCurrent();
await deployWeb();
```

## Source References

- https://nextjs.org/docs/app/guides/deploying-to-platforms
- https://docs.nestjs.com/recipes/terminus
- https://docs.nestjs.com/openapi/introduction
