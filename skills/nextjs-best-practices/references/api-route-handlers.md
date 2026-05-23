---
title: Write Typed API Route Handlers
impact: HIGH
impactDescription: Ensures type safety, consistent error responses, and proper HTTP method handling
tags: api-routes, route-handlers, typing
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: api/route-handlers
---

## Write Typed API Route Handlers

API routes in the `app/` directory use `route.ts` files. Type the request and response properly, handle HTTP methods explicitly, and return consistent error shapes.

**Incorrect (untyped handler, mixed error formats):**

```tsx
// app/api/posts/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  if (!body.title) {
    return new Response('Title required') // inconsistent error format
  }
  const post = await db.post.create({ data: body })
  return Response.json(post) // no status code
}
```

**Correct (typed, consistent errors, proper status codes):**

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const post = await db.post.create({ data: parsed.data })
  return NextResponse.json(post, { status: 201 })
}

export async function GET() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(posts)
}
```

For dynamic routes, await params in Next.js 15+:

```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}
```

Dataset: `dataset/api/route-handlers`

Reference:
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- https://nextjs.org/docs/app/api-reference/file-conventions/route
