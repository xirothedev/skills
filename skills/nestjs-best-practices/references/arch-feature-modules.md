---
title: Keep Features in Cohesive NestJS Modules
impact: CRITICAL
impactDescription: Prevents DI drift, hidden coupling, and untestable service graphs
tags: modules, providers, dependency-injection, boundaries
dataset: arch/feature-module
---

## Keep Features in Cohesive NestJS Modules

NestJS code should group controllers, providers, DTOs, and persistence adapters by feature module. Avoid dumping unrelated providers into `AppModule` or a global shared module.

**Incorrect (root module owns feature internals):**

```typescript
@Module({
  controllers: [UsersController, OrdersController],
  providers: [UsersService, OrdersService, PrismaService],
})
export class AppModule {}
```

**Correct (feature module exports only the public surface):**

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Dataset: `dataset/arch/feature-module`

Reference:
- https://docs.nestjs.com/modules
- https://github.com/nestjs/nest/tree/v11.1.16/sample
