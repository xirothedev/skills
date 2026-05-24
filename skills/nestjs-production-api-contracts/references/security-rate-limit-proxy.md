---
title: Configure Rate Limits for Proxy Topology
impact: HIGH
impactDescription: Prevents all clients behind a proxy from sharing one throttle bucket or attackers bypassing IP tracking
tags: throttler, rate-limiting, proxy, trust-proxy, redis
dataset: security/rate-limit-proxy
---

## Configure Rate Limits for Proxy Topology

When NestJS runs behind a proxy, configure trusted proxy behavior and tracker extraction intentionally. Distributed deployments should use shared throttler storage.

**Incorrect (default IP behind proxy):**

```typescript
ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]);
```

**Correct (proxy-aware tracker/storage):**

```typescript
app.set("trust proxy", "loopback");
```

## Source References

- https://docs.nestjs.com/security/rate-limiting
