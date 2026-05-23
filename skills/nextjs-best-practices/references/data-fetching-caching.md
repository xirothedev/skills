---
title: Cache Responses Appropriately with fetch Options
impact: CRITICAL
impactDescription: Prevents stale data or unnecessary server load by choosing the right cache strategy
tags: data-fetching, caching, fetch-api
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: data/fetching-caching
---

## Cache Responses Appropriately with fetch Options

Next.js extends the native `fetch()` API with caching options. Choose the right strategy for each data source. There is no one-size-fits-all cache setting.

| Strategy | Code | Use Case |
|----------|------|----------|
| Cached (default) | `fetch(url)` | Static content, rarely changes |
| Time-based revalidation | `fetch(url, { next: { revalidate: 3600 } })` | Content that refreshes periodically |
| No cache | `fetch(url, { cache: 'no-store' })` | Real-time data, user-specific content |
| Force static generation | `fetch(url, { next: { revalidate: false } })` | Build-time only data |

**Incorrect (unbounded caching real-time data):**

```tsx
async function getUserProfile(userId: string) {
  // Default fetch caches forever — stale user profiles
  const res = await fetch(`/api/users/${userId}`)
  return res.json()
}
```

**Correct (explicit cache strategy per data type):**

```tsx
async function getUserProfile(userId: string) {
  // No cache for user-specific real-time data
  const res = await fetch(`/api/users/${userId}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

async function getSiteSettings() {
  // Cache for 1 hour — settings rarely change
  const res = await fetch(`/api/settings`, {
    next: { revalidate: 3600 },
  })
  return res.json()
}
```

For route-level caching, export `revalidate` from a layout or page:

```tsx
export const revalidate = 3600 // revalidate all data in this route every hour
```

For cross-request deduplication within the same request lifecycle, use `React.cache()`:

```tsx
import { cache } from 'react'

export const getPost = cache(async (id: string) => {
  return await db.post.findUnique({ where: { id } })
})
```

Dataset: `dataset/data/fetching-caching`

Reference:
- https://nextjs.org/docs/app/building-your-application/caching
- https://nextjs.org/docs/app/api-reference/functions/fetch
