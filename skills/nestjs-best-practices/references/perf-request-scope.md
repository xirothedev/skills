---
title: Avoid Request-Scoped Providers Unless Required
impact: MEDIUM-HIGH
impactDescription: Prevents per-request provider graph allocation on hot paths
tags: provider-scope, performance, request-context, runtime
dataset: perf/request-scope
---

## Avoid Request-Scoped Providers Unless Required

Request-scoped providers are useful for true request context, but they make NestJS instantiate more of the dependency graph per request. Prefer singleton providers plus explicit context parameters for hot paths.

**Incorrect (request scope for ordinary service logic):**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  findAll() {
    return this.repo.findMany();
  }
}
```

**Correct (singleton service, explicit context only where needed):**

```typescript
@Injectable()
export class UsersService {
  findAll(context: RequestContext) {
    return this.repo.findManyForTenant(context.tenantId);
  }
}
```

Dataset: `dataset/perf/request-scope`

Reference:
- https://docs.nestjs.com/fundamentals/injection-scopes
- https://docs.nestjs.com/fundamentals/lifecycle-events
