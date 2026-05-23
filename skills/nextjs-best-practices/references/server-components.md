---
title: Default to Server Components, Opt Into Client When Needed
impact: CRITICAL
impactDescription: Reduces client bundle size, enables server-side data access, improves initial load performance
tags: server-components, client-components, boundaries
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: server/components
---

## Default to Server Components, Opt Into Client When Needed

Components in the `app/` directory are Server Components by default. Only add `'use client'` when you need interactivity (state, effects, event handlers, browser APIs). Minimize the client boundary to reduce JavaScript shipped to the browser.

**Incorrect (entire page is Client Component):**

```tsx
// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])

  return (
    <main>
      <h1>Dashboard</h1>
      {posts.map(p => <div key={p.id}>{p.title}</div>)}
    </main>
  )
}
```

**Correct (Server Component fetches, small Client Component for interactivity):**

```tsx
// app/dashboard/page.tsx (Server Component)
import { getPosts } from '@/lib/data'
import { PostList } from './post-list'

export default async function Dashboard() {
  const posts = await getPosts()
  return (
    <main>
      <h1>Dashboard</h1>
      <PostList initialPosts={posts} />
    </main>
  )
}
```

```tsx
// app/dashboard/post-list.tsx (Client Component)
'use client'

import { useState } from 'react'

export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [filter, setFilter] = useState('')
  const filtered = initialPosts.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filtered.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  )
}
```

The Server Component fetches data on the server with zero client JavaScript. The Client Component only handles the interactive filter input.

Dataset: `dataset/server/components`

Reference:
- https://nextjs.org/docs/app/building-your-application/rendering/server-components
- https://nextjs.org/docs/app/building-your-application/rendering/client-components
