---
title: Stream UI with Suspense Boundaries
impact: HIGH
impactDescription: Enables progressive rendering, shows content faster, prevents waterfall loading
tags: streaming, suspense, performance
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: perf/streaming
---

## Stream UI with Suspense Boundaries

Wrap slow or data-dependent components in `<Suspense>` to stream HTML to the client as it becomes ready. This lets users see critical content immediately while slower parts load in the background.

**Incorrect (waits for all data before showing anything):**

```tsx
// app/page.tsx
export default async function Page() {
  const posts = await getPosts()        // fast
  const comments = await getComments()  // slow
  const user = await getUser()          // slow

  return (
    <div>
      <PostList posts={posts} />
      <Comments comments={comments} />
      <UserProfile user={user} />
    </div>
  )
}
```

**Correct (stream each section independently):**

```tsx
// app/page.tsx
import { Suspense } from 'react'

export default async function Page() {
  const posts = await getPosts() // fast — render immediately

  return (
    <div>
      <PostList posts={posts} />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments /> {/* async Server Component — streams when ready */}
      </Suspense>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile /> {/* async Server Component — streams when ready */}
      </Suspense>
    </div>
  )
}

// app/comments.tsx (Server Component)
export default async function Comments() {
  const comments = await getComments() // slow query
  return <CommentList comments={comments} />
}
```

Nest Suspense boundaries to stream content in the order of importance:

```tsx
<Suspense fallback={<MainSkeleton />}>
  <MainContent />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar /> {/* renders after MainContent */}
  </Suspense>
</Suspense>
```

Dataset: `dataset/perf/streaming`

Reference:
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- https://nextjs.org/docs/app/building-your-application/rendering/suspense
