---
title: Test NestJS Units with Provider Overrides
impact: MEDIUM
impactDescription: Makes tests deterministic without booting unrelated infrastructure
tags: testing, providers, mocks, e2e, modules
dataset: test/provider-override
---

## Test NestJS Units with Provider Overrides

Use `Test.createTestingModule` and override providers at module boundaries. Avoid integration-heavy setup for unit tests that only need one provider or resolver.

**Incorrect (unit test boots real dependencies):**

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
}).compile();
```

**Correct (override the collaborator):**

```typescript
const moduleRef = await Test.createTestingModule({
  providers: [UsersService, { provide: UsersRepo, useValue: usersRepoMock }],
}).compile();
```

Dataset: `dataset/test/provider-override`

Reference:
- https://docs.nestjs.com/fundamentals/testing
