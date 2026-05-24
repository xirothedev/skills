---
title: Match Invalidation API to User Freshness Needs
impact: HIGH
impactDescription: Avoids stale user-visible data after mutations and avoids over-invalidating shared caches
tags: updateTag, revalidateTag, server-actions, route-handlers
dataset: cache/tag-invalidation
---

## Match Invalidation API to User Freshness Needs

Use `updateTag` in Server Actions when the mutating user must immediately see their own writes. Use `revalidateTag` when stale-while-revalidate behavior is acceptable or the invalidation runs from a Route Handler.

**Incorrect (mutation does not expire cache):**

```typescript
export async function createPost(formData: FormData) {
  "use server";
  await db.post.create({ data: { title: String(formData.get("title")) } });
}
```

**Correct (read-your-own-writes):**

```typescript
export async function createPost(formData: FormData) {
  "use server";
  await db.post.create({ data: { title: String(formData.get("title")) } });
  updateTag("posts");
}
```

## Source References

- https://nextjs.org/docs/app/getting-started/revalidating
- https://nextjs.org/docs/app/api-reference/functions/updateTag
