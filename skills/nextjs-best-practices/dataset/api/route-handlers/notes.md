# API Route Handlers Dataset

Use this case when writing or reviewing API route handlers in the `app/` directory.

## What this covers
- Typed request/response with `NextRequest` and `NextResponse`
- Consistent error response shape across all routes
- Proper HTTP status codes
- Zod validation at the boundary
- Dynamic route params with `await params` (Next.js 15+)
- Explicit HTTP method handlers (GET, POST, PUT, DELETE, PATCH)

## Key decisions
- Use `NextResponse` over raw `Response` for convenience (status, json, cookies, headers)
- Return `{ error, details? }` shape consistently — not mixed strings/objects
- Validate input with Zod before touching the database
- Use `take`/`limit` on every list query to prevent unbounded results
- For dynamic routes, `params` is a `Promise` in Next.js 15+ — always `await` it

## Status code conventions
- `200` — successful GET
- `201` — successful POST (resource created)
- `204` — successful DELETE (no content)
- `400` — validation failure
- `401` — unauthenticated
- `403` — unauthorized
- `404` — resource not found
- `405` — method not allowed (return from unmatched method handler)

## NextRequest and NextResponse

`NextRequest` extends the standard `Request` with Next.js-specific helpers:
- `request.nextUrl` — parsed URL with pathname, searchParams
- `request.cookies` — read cookies
- `request.headers` — standard headers interface

`NextResponse` extends `Response` with convenience methods:
- `NextResponse.json(data, { status })` — JSON response with status
- `NextResponse.redirect(url)` — redirect response
- `NextResponse.rewrite(url)` — URL rewrite without redirect

## Zod validation at boundary

Always validate at the API boundary, not inside service layers. This ensures:
- Clear error messages returned to clients
- Type narrowing for database operations
- Consistent validation logic across routes

```tsx
const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
})

const parsed = schema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: parsed.error.flatten() },
    { status: 400 }
  )
}
// parsed.data is now typed and validated
```

## Consistent error response shape

All error responses should follow `{ error: string, details?: unknown }`:

```tsx
// Validation error
{ error: 'Validation failed', details: fieldErrors }

// Not found
{ error: 'Post not found' }

// Unauthorized
{ error: 'Unauthorized' }
```

Never return plain strings or mixed formats.

## Dynamic route params (Next.js 15+)

In Next.js 15+, route handler `params` is a `Promise`. Always await it:

```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // MUST await
  // ...
}
```

Without `await`, you get a Promise object, not the actual params — causes runtime errors.

## Prevent unbounded list queries

Always use `take` (Prisma) or `limit` (SQL) on list endpoints:

```tsx
// Good — bounded
const posts = await db.post.findMany({
  orderBy: { createdAt: 'desc' },
  take: 50,
})

// Bad — unbounded, crashes with large datasets
const posts = await db.post.findMany()
```

## Explicit method handlers

Export named functions for allowed methods. Next.js automatically returns 405 for unhandled methods:

```tsx
// app/api/posts/route.ts
export async function GET(request: NextRequest) { /* ... */ }
export async function POST(request: NextRequest) { /* ... */ }
// PUT, DELETE, PATCH only exported if needed
```

No need to manually handle 405 — Next.js does this for you.