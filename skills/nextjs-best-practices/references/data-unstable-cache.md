---
title: Use unstable_cache for Cross-Request Deduplication
impact: MEDIUM
impactDescription: Deduplicates expensive queries across requests, reduces database load
tags: caching, unstable-cache, deduplication
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: data/unstable-cache
---

## Use unstable_cache for Cross-Request Deduplication

`unstable_cache` wraps expensive functions (database queries, external API calls) with cross-request caching. Results are cached across all requests until invalidated by tags or time.

**Incorrect (query runs on every request):**

```tsx
// lib/data.ts
export async function getPopularPosts() {
  return db.post.findMany({
    orderBy: { views: 'desc' },
    take: 10,
  })
}

// app/popular/page.tsx
export default async function PopularPage() {
  const posts = await getPopularPosts() // Runs every request
  return <PostList posts={posts} />
}
```

**Correct (cached with tags and time-based revalidation):**

```tsx
// lib/data.ts
import { unstable_cache } from 'next/cache'

export const getPopularPosts = unstable_cache(
  async () => {
    return db.post.findMany({
      orderBy: { views: 'desc' },
      take: 10,
    })
  },
  ['popular-posts'],
  { revalidate: 3600, tags: ['posts'] }
)

// app/popular/page.tsx
export default async function PopularPage() {
  const posts = await getPopularPosts() // Cached for 1 hour
  return <PostList posts={posts} />
}
```

To invalidate:

```tsx
'use server'
import { revalidateTag } from 'next/cache'

export async function republishPost(postId: string) {
  await db.post.update({ where: { id: postId }, data: { published: true } })
  revalidateTag('posts') // Clears all cached queries with tag 'posts'
}
```

Despite the "unstable" prefix, this is the recommended API for programmatic caching in the App Router.

Dataset: `dataset/data/unstable-cache`

Reference:
- https://nextjs.org/docs/app/api-reference/functions/unstable_cache
- https://nextjs.org/docs/app/building-your-application/caching#react-cache
