---
title: Compose Guards with Resource Policy Checks
impact: CRITICAL
impactDescription: Prevents authenticated users from acting on resources they do not own
tags: guards, authorization, policies, ownership, tenants
dataset: security/policy-guards
---

## Compose Guards with Resource Policy Checks

Authentication guards answer who the caller is. Resource policy checks answer what they can do. Controllers or application services must enforce both.

**Incorrect (role only):**

```typescript
@UseGuards(JwtAuthGuard)
@Delete(":id")
remove(@Param("id") id: string) {
  return this.postsService.remove(id);
}
```

**Correct (caller plus resource policy):**

```typescript
@UseGuards(JwtAuthGuard)
@Delete(":id")
remove(@CurrentUser() user: User, @Param("id") id: string) {
  return this.postsService.removeForActor(user.id, id);
}
```

## Source References

- https://docs.nestjs.com/guards
- https://docs.nestjs.com/fundamentals/execution-context
