---
title: Authenticate Server Actions Like API Routes
impact: HIGH
impactDescription: Prevents unauthorized mutations through Server Actions, same security posture as API routes
tags: security, authentication, server-actions
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: security/auth-actions
---

## Authenticate Server Actions Like API Routes

Server Actions are callable from the client. Always verify authentication and authorization before performing mutations, exactly as you would in an API route.

**Incorrect (unauthenticated mutation):**

```tsx
// app/actions.ts
'use server'

export async function deletePost(postId: string) {
  // No auth check — anyone can call this
  await db.post.delete({ where: { id: postId } })
}
```

**Correct (auth check at the top of the action):**

```tsx
// app/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post || post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
  revalidatePath('/posts')
}
```

For role-based authorization, check the user's role:

```tsx
'use server'

export async function banUser(targetUserId: string) {
  const session = await auth()
  if (session?.user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await db.user.update({ where: { id: targetUserId }, data: { banned: true } })
}
```

Dataset: `dataset/security/auth-actions`

Reference:
- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security
- https://nextjs.org/docs/app/building-your-application/authentication
