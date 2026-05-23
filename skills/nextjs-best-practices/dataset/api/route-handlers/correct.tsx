// Correct pattern: Typed API route handlers with NextRequest/NextResponse
// app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

// Zod schema for validation at boundary
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().optional(),
  published: z.boolean().optional().default(false),
})

// POST /api/posts — Create a new post
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    // Consistent error shape with details
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  // Typed data from Zod
  const post = await db.post.create({ data: parsed.data })

  // 201 Created for resource creation
  return NextResponse.json(post, { status: 201 })
}

// GET /api/posts — List posts with pagination limit
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const rawLimit = searchParams.get('limit')
  const limit = Number(rawLimit) >= 1 ? Math.min(Math.floor(Number(rawLimit)), 100) : 50

  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit, // Prevents unbounded results
  })

  return NextResponse.json(posts)
}

// app/api/posts/[id]/route.ts — Dynamic route with await params

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/posts/[id] — Get single post
// (In a real project, this lives in app/api/posts/[id]/route.ts)
export async function GET_SINGLE_POST(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params // MUST await in Next.js 15+

  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(post)
}

// PUT /api/posts/[id] — Update post
const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params
  const body = await request.json()
  const parsed = updatePostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const post = await db.post.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(post)
}

// DELETE /api/posts/[id] — Delete post
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params

  const existing = await db.post.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  await db.post.delete({ where: { id } })

  // 204 No Content for successful deletion
  return new NextResponse(null, { status: 204 })
}