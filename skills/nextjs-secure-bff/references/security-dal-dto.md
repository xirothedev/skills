---
title: Isolate Data Access and Return Minimal DTOs
impact: CRITICAL
impactDescription: Prevents private records from crossing into Client Component props or action responses
tags: dal, dto, server-only, client-components, data-security
dataset: security/dal-dto
---

## Isolate Data Access and Return Minimal DTOs

New Next.js applications should centralize privileged reads and writes in a server-only Data Access Layer. The DAL should authorize access and return only fields the UI needs.

**Incorrect (database record flows to client):**

```typescript
const user = await db.user.findUnique({ where: { id } });
return <ProfileCard user={user} />;
```

**Correct (authorized DTO):**

```typescript
const profile = await getProfileDTO(id);
return <ProfileCard profile={profile} />;
```

## Source References

- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/getting-started/server-and-client-components
