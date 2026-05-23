---
title: Revalidate Data with Time-Based or On-Demand Strategies
impact: HIGH
impactDescription: Keeps cached data fresh without over-fetching or manual cache invalidation
tags: revalidation, cache-invalidation, on-demand
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: data/revalidation
---

## Revalidate Data with Time-Based or On-Demand Strategies

Next.js provides two revalidation strategies. Choose based on freshness requirements:

1. **Time-based**: Data revalidates after a set interval (`revalidate` export or `next: { revalidate }`)
2. **On-demand**: Data revalidates when you call `revalidatePath()` or `revalidateTag()`

**Incorrect (no revalidation, permanently stale):**

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
// No revalidate export — cached forever after first request
```

**Correct (time-based revalidation):**

```tsx
// app/blog/page.tsx
export const revalidate = 60 // revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

**Correct (on-demand revalidation after mutation):**

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(data: PostData) {
  await db.post.create({ data })
  revalidatePath('/blog') // invalidate blog list on next request
}
```

**Correct (tag-based revalidation for granular control):**

```tsx
// data fetching with tags
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  })
  return res.json()
}

// on-demand invalidation
'use server'
import { revalidateTag } from 'next/cache'

export async function updatePost(id: string, data: PostData) {
  await db.post.update({ where: { id }, data })
  revalidateTag('posts') // invalidate all data tagged 'posts'
}
```

Use `revalidatePath` for route-level invalidation and `revalidateTag` for data-level invalidation across multiple routes.

Dataset: `dataset/data/revalidation`

Reference:
- https://nextjs.org/docs/app/building-your-application/caching#revalidating-data
- https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
