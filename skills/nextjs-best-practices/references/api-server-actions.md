---
title: Use Server Actions for Mutations, Not API Routes
impact: HIGH
impactDescription: Simplifies mutation flow, eliminates client-side fetch boilerplate, integrates with Next.js caching
tags: server-actions, mutations, api-routes
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: api/server-actions
---

## Use Server Actions for Mutations, Not API Routes

For form submissions and client-triggered mutations, prefer Server Actions over API routes. Server Actions run on the server, have direct database access, and integrate with Next.js caching and revalidation.

**Incorrect (API route for form mutation):**

```tsx
// app/create-post/page.tsx
'use client'

export function CreatePostForm() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    if (!res.ok) throw new Error('Failed')
    router.push('/posts')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

**Correct (Server Action for mutation):**

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.post.create({ data: { title } })
  revalidatePath('/posts')
  redirect('/posts')
}
```

```tsx
// app/create-post/page.tsx
import { createPost } from '@/app/actions'

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

Server Actions work with HTML forms natively (progressive enhancement) and can also be called from Client Components:

```tsx
'use client'

import { createPost } from '@/app/actions'

export function PostButton() {
  return <button onClick={() => createPost(new FormData())}>Quick Post</button>
}
```

Dataset: `dataset/api/server-actions`

Reference:
- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- https://nextjs.org/docs/app/api-reference/functions/use-server-entry
