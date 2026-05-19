---
title: Translate Domain Failures to NestJS Exceptions at Boundaries
impact: HIGH
impactDescription: Produces consistent HTTP and transport error contracts
tags: exceptions, filters, errors, logging, contracts
dataset: errors/domain-exception
---

## Translate Domain Failures to NestJS Exceptions at Boundaries

Throw meaningful NestJS exceptions for API failures and use filters only for cross-cutting formatting. Avoid returning null or ad hoc error objects from controllers.

**Incorrect (ambiguous response contract):**

```typescript
const user = await this.usersService.findOne(id);
return user ?? { error: "not found" };
```

**Correct (explicit exception):**

```typescript
const user = await this.usersService.findOne(id);
if (!user) throw new NotFoundException("User not found");
return user;
```

Dataset: `dataset/errors/domain-exception`

Reference:
- https://docs.nestjs.com/exception-filters
