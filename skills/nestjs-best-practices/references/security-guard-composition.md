---
title: Put Auth and Authorization in Guards
impact: CRITICAL
impactDescription: Keeps access policy centralized and testable
tags: guards, auth, authorization, rbac, security
dataset: security/guard-composition
---

## Put Auth and Authorization in Guards

Do not bury route authorization inside controllers or services. Use guards and metadata so access rules are visible at the route boundary.

**Incorrect (controller hand-rolls policy):**

```typescript
@Get(":id")
findOne(@Req() req: Request, @Param("id") id: string) {
  if (!req.user) throw new UnauthorizedException();
  return this.usersService.findOneForUser(id, req.user);
}
```

**Correct (route declares policy):**

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Get(":id")
findOne(@Param("id") id: string) {
  return this.usersService.findOne(id);
}
```

Dataset: `dataset/security/guard-composition`

Reference:
- https://docs.nestjs.com/guards
- https://docs.nestjs.com/security/authentication
