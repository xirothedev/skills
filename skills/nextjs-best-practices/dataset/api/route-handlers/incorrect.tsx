// Incorrect pattern: Anti-patterns in API route handlers
// app/api/posts/route.ts

import { db } from '@/lib/db'

// Problem 1: Untyped handler with raw Request/Response
// - No type safety on request body
// - No NextRequest helpers (nextUrl, cookies)
// - Raw Response is less ergonomic
export async function POST(req: Request) {
  const body = await req.json()

  // Problem 2: No validation — crashes on bad input
  // If body.title is missing or wrong type, this throws at runtime
  const post = await db.post.create({
    data: {
      title: body.title, // undefined if not provided — database error
      content: body.content,
    },
  })

  // Problem 3: Mixed error formats — returns plain string
  // Inconsistent with other routes that return { error: string }
  if (!body.title) {
    return new Response('Title required', { status: 400 })
  }

  // Problem 4: No explicit status code — defaults to 200 even for creation
  // Should be 201 for resource creation
  return Response.json(post)
}

// Problem 5: No limit on list queries — unbounded results
export async function GET() {
  // With 100,000 posts, this returns all of them
  // Causes memory issues, slow responses, and potential crashes
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    // Missing: take: 50
  })

  return Response.json(posts)
}

// app/api/posts/[id]/route.ts

// Problem 6: Dynamic route without await params (Next.js 15+ breaking)
export async function GET_DYNAMIC(
  request: Request,
  { params }: { params: { id: string } } // Wrong: should be Promise
) {
  // Problem: In Next.js 15+, params is a Promise
  // Without await, this gets the Promise object, not the id string
  const { id } = params // This is broken in Next.js 15+

  // Problem 7: No 404 handling — returns null if not found
  // Client gets 200 with null body instead of proper 404
  const post = await db.post.findUnique({ where: { id } })

  return Response.json(post) // Returns null with 200 status if not found
}

// Problem 8: Mixed error response formats across routes
export async function PUT_BROKEN(req: Request) {
  const body = await req.json()

  if (!body.title) {
    // Returns plain string
    return new Response('Title required', { status: 400 })
  }

  const existing = await db.post.findUnique({ where: { id: body.id } })

  if (!existing) {
    // Returns object but inconsistent shape
    return Response.json({ message: 'Not found', code: 'POST_404' }, { status: 404 })
  }

  if (body.title.length > 200) {
    // Yet another format with different key
    return Response.json({ msg: 'Title too long' }, { status: 400 })
  }

  const post = await db.post.update({
    where: { id: body.id },
    data: { title: body.title },
  })

  return Response.json(post)
}

// Problem 9: No explicit DELETE status
export async function DELETE_BROKEN(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  await db.post.delete({ where: { id } })

  // Problem: Returns 200 with null instead of 204 No Content
  return Response.json(null)
}

// Summary of problems:
// 1. Untyped Request/Response instead of NextRequest/NextResponse
// 2. No Zod validation — crashes on bad input
// 3. Mixed error formats: strings, objects with different keys
// 4. Missing status codes (201 for creation, 204 for deletion)
// 5. Unbounded list queries without take/limit
// 6. Dynamic routes without await params (breaks in Next.js 15+)
// 7. No 404 handling — returns null with 200 status
// 8. Inconsistent error shapes across routes
// 9. DELETE returns 200 with null body instead of 204