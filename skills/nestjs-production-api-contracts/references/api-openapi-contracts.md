---
title: Keep OpenAPI Contracts Bound to DTOs
impact: CRITICAL
impactDescription: Prevents generated clients from drifting away from real request and response shapes
tags: openapi, swagger, dto, controllers, contracts
dataset: api/openapi-contracts
---

## Keep OpenAPI Contracts Bound to DTOs

OpenAPI decorators should describe DTO classes and explicit response types. Avoid untyped controller bodies that produce vague schemas and generated client drift.

**Incorrect (untyped body and response):**

```typescript
@Post()
create(@Body() body: any) {
  return this.usersService.create(body);
}
```

**Correct (documented DTO contract):**

```typescript
@Post()
@ApiCreatedResponse({ type: UserResponseDto })
create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
  return this.usersService.create(dto);
}
```

## Source References

- https://docs.nestjs.com/openapi/types-and-parameters
- https://docs.nestjs.com/techniques/validation
