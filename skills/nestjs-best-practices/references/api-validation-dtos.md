---
title: Validate API Input with DTOs and Pipes
impact: CRITICAL
impactDescription: Blocks unsafe payloads before they reach services
tags: controllers, dto, validation, pipes, contracts
dataset: api/validation-dto
---

## Validate API Input with DTOs and Pipes

Controllers should accept DTO classes and rely on `ValidationPipe` instead of passing raw request bodies into services.

**Incorrect (raw object reaches business logic):**

```typescript
@Post()
create(@Body() body: any) {
  return this.usersService.create(body);
}
```

**Correct (DTO enforces the route contract):**

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

Dataset: `dataset/api/validation-dto`

Reference:
- https://docs.nestjs.com/techniques/validation
- https://docs.nestjs.com/controllers
