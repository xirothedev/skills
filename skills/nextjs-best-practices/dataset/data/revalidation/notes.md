# Data Revalidation Strategies in Next.js

## Overview

Revalidation determines when cached data becomes stale and should be refetched. Without revalidation, cached data remains frozen indefinitely, leading to permanently stale content.

## Time-Based Revalidation

Data automatically revalidates after a specified time interval.

### Route-Level Export

```tsx
// app/blog/page.tsx
export const revalidate = 60 // seconds

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <BlogList posts={posts} />
}
```

- Applies to all `fetch` requests in the route
- Simple, declarative syntax
- Good for content with predictable update patterns (news, feeds, pricing)

### Per-Request Configuration

```tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 300 }, // 5 minutes
  })
  return res.json()
}
```

- Granular control per fetch call
- Different revalidation intervals for different data sources
- Overrides route-level `revalidate` export

## On-Demand Revalidation

Data revalidates only when explicitly triggered, typically after mutations.

### Path-Based Invalidation

```tsx
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(data: PostData) {
  await db.post.create({ data })
  revalidatePath('/blog') // Invalidate all data under /blog
}
```

- Invalidates all cached data for a route path
- Useful when a mutation affects an entire page or section
- Less granular than tag-based invalidation

### Tag-Based Invalidation

```tsx
// Fetch with tag
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  })
  return res.json()
}

// Invalidate by tag
'use server'
import { revalidateTag } from 'next/cache'

export async function updatePost(id: string, data: PostData) {
  await db.post.update({ where: { id }, data })
  revalidateTag('posts') // Invalidates all fetches tagged 'posts'
}
```

- Most granular control
- One tag can span multiple routes
- Ideal for data used across different pages
- Decouples cache invalidation from route structure

## When to Use Each Strategy

| Strategy | Use Case | Pros | Cons |
|----------|----------|------|------|
| Time-based | Content with predictable update cadence | Simple, automatic | May serve stale data between intervals |
| `revalidatePath` | Mutations affecting entire route | Easy to implement | Over-invalidates for single-item changes |
| `revalidateTag` | Mutations affecting specific data type | Precise, reusable | Requires planning tag taxonomy |

## Why Revalidation Matters

1. **Freshness**: Users see updated content without manual refresh
2. **Performance**: Cached responses reduce latency and API load
3. **Consistency**: On-demand revalidation ensures data reflects mutations immediately
4. **Efficiency**: Tag-based invalidation avoids over-fetching unrelated cached data

## Best Practices

- Default to time-based for read-heavy, mutation-light data
- Use tag-based revalidation for data tied to specific entities (posts, users, products)
- Reserve `revalidatePath` for broad invalidation (e.g., after bulk imports)
- Combine strategies: time-based for baseline freshness, on-demand for immediate consistency after mutations