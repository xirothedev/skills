---
title: Use External Cache Stores for Shared Runtime State
impact: HIGH
impactDescription: Prevents each instance from caching different values or losing cache on restart
tags: cache-manager, redis, cache-module, multi-instance
dataset: ops/cache-store
---

## Use External Cache Stores for Shared Runtime State

In-memory cache is fine for one process and short-lived optimization. Use Redis or another external store for shared cache state, invalidation, or rate-sensitive production flows.

**Incorrect (local memory in production):**

```typescript
CacheModule.register({ ttl: 60 });
```

**Correct (external store):**

```typescript
CacheModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    stores: [createKeyv(config.getOrThrow("REDIS_URL"))],
  }),
  inject: [ConfigService],
});
```

## Source References

- https://docs.nestjs.com/techniques/caching
