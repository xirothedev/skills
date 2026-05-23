---
title: Await Route Params in Server Components (Next.js 15+)
impact: CRITICAL
impactDescription: Prevents runtime errors and incorrect param access after Next.js 15 made params async
tags: server-components, routing, params
versionScope: "15.x.x, 16.x.x"
dataset: server/async-params
---

## Await Route Params in Server Components (Next.js 15+)

In Next.js 15 and later, `params` and `searchParams` in Server Components are Promises. You must `await` them before accessing properties. This change improves the React compiler's ability to optimize rendering.

**Incorrect (sync params access — broken in Next.js 15+):**

```tsx
// app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id) // Runtime error: params is a Promise
  return <h1>{post.title}</h1>
}
```

**Correct (await params in Next.js 15+):**

```tsx
// app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
  return <h1>{post.title}</h1>
}
```

For API routes (`app/api/.../route.ts`), `params` is also a Promise in Next.js 15+. The same `await` pattern applies:

```tsx
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await getPost(id)
  return NextResponse.json(post)
}
```

Dataset: `dataset/server/async-params`

Reference:
- https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
- https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-apis
