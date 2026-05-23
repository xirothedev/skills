# Async Params Dataset

Use this case when working with route params and searchParams in Next.js 15+.

## Breaking Change in Next.js 15

In Next.js 15, `params` and `searchParams` are now **Promises** and must be awaited.

### Why the change?

- Enables async rendering at the route segment level
- Allows partial rendering with Suspense boundaries
- Aligns with React's async component model
- Improves error handling for invalid route params

## Incorrect (Sync access — broken in Next.js 15+)

```tsx
// page.tsx — will throw error in Next.js 15+
export default function Page({ params }: { params: { id: string } }) {
  return <div>Product {params.id}</div>  // TypeError: params is a Promise
}

// route.ts — will throw error in Next.js 15+
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ id: params.id })  // TypeError
}
```

## Correct (Async access — Next.js 15+)

```tsx
// page.tsx
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { filter } = await searchParams
  
  return <div>Product {id} {filter && `- filtered by ${filter}`}</div>
}

// route.ts
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params
  return Response.json({ id })
}
```

## Migration Guide

1. Add `async` to your page/route function if not already async
2. Change params type from `{ id: string }` to `Promise<{ id: string }>`
3. Add `await` before accessing params
4. Same pattern for searchParams

## Dynamic Routes Reference

| Route Pattern | params type |
|---------------|-------------|
| `app/products/page.tsx` | None |
| `app/products/[id]/page.tsx` | `Promise<{ id: string }>` |
| `app/products/[category]/[id]/page.tsx` | `Promise<{ category: string, id: string }>` |
| `app/shop/[...slug]/page.tsx` | `Promise<{ slug: string[] }>` |

## Note on Next.js 14

In Next.js 14, params were synchronous but the async pattern was introduced as a preview. If migrating from 14 to 15, all params access must be updated to use await.