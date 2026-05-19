---
title: Validate Configuration at Startup
impact: MEDIUM
impactDescription: Fails fast before bad runtime config corrupts API behavior
tags: config, startup, environment, operations
dataset: ops/config-validation
---

## Validate Configuration at Startup

Configuration should be loaded through `ConfigModule` with validation. Do not read arbitrary `process.env` values throughout providers.

**Incorrect (late undefined failure):**

```typescript
const ttl = Number(process.env.JWT_TTL_SECONDS);
```

**Correct (central validated config):**

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validate: validateEnv,
});
```

Dataset: `dataset/ops/config-validation`

Reference:
- https://docs.nestjs.com/techniques/configuration
- https://docs.nestjs.com/recipes/terminus
