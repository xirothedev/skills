---
title: Inherit Global App Config in Hybrid Microservices
impact: CRITICAL
impactDescription: Prevents connected microservices from missing global pipes, guards, filters, or interceptors
tags: hybrid-app, microservices, global-pipes, inheritAppConfig
dataset: transport/hybrid-config
---

## Inherit Global App Config in Hybrid Microservices

Hybrid applications should opt into inheriting global pipes, guards, filters, and interceptors from the main app when the transport should share the same cross-cutting policy.

**Incorrect (microservice misses app config):**

```typescript
app.connectMicroservice({ transport: Transport.TCP });
```

**Correct (inherited config):**

```typescript
app.connectMicroservice(
  { transport: Transport.TCP },
  { inheritAppConfig: true },
);
```

## Source References

- https://docs.nestjs.com/faq/hybrid-application
- https://docs.nestjs.com/microservices/basics
