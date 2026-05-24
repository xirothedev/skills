---
title: Re-authorize Inside Every Server Action
impact: CRITICAL
impactDescription: Prevents direct POST invocation from bypassing page-level checks
tags: server-actions, auth, authorization, idor, mutations
dataset: security/server-action-authz
---

## Re-authorize Inside Every Server Action

Server Actions are mutation entry points. A page-level redirect or hidden button is not authorization. Re-check authentication and resource ownership inside the action or inside the DAL function it calls.

**Incorrect (page guard only):**

```typescript
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  async function deleteUser(formData: FormData) {
    "use server";
    await db.user.delete({ where: { id: String(formData.get("id")) } });
  }

  return <form action={deleteUser}>...</form>;
}
```

**Correct (action guard plus ownership/policy):**

```typescript
export async function deleteUserAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Forbidden");

  const userId = String(formData.get("id"));
  await deleteUserAsAdmin({ actorId: session.user.id, userId });
}
```

## Source References

- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/guides/forms
