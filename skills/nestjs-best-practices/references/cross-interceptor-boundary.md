---
title: Use Interceptors for Cross-Cutting Response Flow
impact: MEDIUM-HIGH
impactDescription: Avoids duplicating response shaping, timing, and cache behavior in controllers
tags: interceptors, pipes, middleware, response, request-flow
dataset: cross/interceptor-boundary
---

## Use Interceptors for Cross-Cutting Response Flow

Use controllers for route orchestration, pipes for input transformation, guards for access, and interceptors for response-side cross-cutting behavior.

**Incorrect (every controller repeats response shaping):**

```typescript
@Get()
async findAll() {
  const data = await this.usersService.findAll();
  return { data, generatedAt: new Date().toISOString() };
}
```

**Correct (interceptor owns common envelope):**

```typescript
@UseInterceptors(ResponseEnvelopeInterceptor)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

Dataset: `dataset/cross/interceptor-boundary`

Reference:
- https://docs.nestjs.com/interceptors
- https://docs.nestjs.com/pipes
