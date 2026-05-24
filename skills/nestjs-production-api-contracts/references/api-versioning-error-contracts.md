---
title: Version Public APIs and Normalize Error Envelopes
impact: CRITICAL
impactDescription: Prevents clients from depending on unstable error shapes or unversioned breaking changes
tags: versioning, exception-filters, errors, contracts
dataset: api/versioning-error-contracts
---

## Version Public APIs and Normalize Error Envelopes

Public APIs need a clear versioning strategy and a stable error response shape. Exception filters should map internal exceptions to generic, documented client errors.

**Incorrect (raw exception shape):**

```typescript
throw new Error(`database failed for user ${email}`);
```

**Correct (public exception contract):**

```typescript
throw new BadRequestException({
  code: "INVALID_REQUEST",
  message: "Invalid request",
});
```

## Source References

- https://docs.nestjs.com/techniques/versioning
- https://docs.nestjs.com/exception-filters
