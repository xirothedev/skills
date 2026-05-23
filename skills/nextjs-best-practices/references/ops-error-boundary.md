---
title: Handle Errors with error.tsx and global-error.tsx
impact: MEDIUM
impactDescription: Provides graceful error recovery, prevents broken UI on route failures
tags: error-handling, boundaries, ux
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: ops/error-boundary
---

## Handle Errors with error.tsx and global-error.tsx

Next.js provides built-in error boundaries. Use `error.tsx` for route-level errors and `global-error.tsx` for app-level failures.

**Route-level error boundary (error.tsx):**

```tsx
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

**Global error boundary (global-error.tsx):**

```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Application Error</h2>
        <button onClick={() => reset()}>Reload</button>
      </body>
    </html>
  )
}
```

Key differences:
- `error.tsx`: Catches errors in the route segment. Must be a Client Component. Automatically wraps the route's `page.tsx`.
- `global-error.tsx`: Catches errors outside any route segment (e.g., root layout failures). Must include `<html>` and `<body` tags. Only one per app.

For not-found pages, use `not-found.tsx`:

```tsx
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

Trigger `notFound()` from Server Components:

```tsx
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id } })
  if (!post) notFound()
  return <article>{post.title}</article>
}
```

Dataset: `dataset/ops/error-boundary`

Reference:
- https://nextjs.org/docs/app/building-your-application/routing/error-handling
- https://nextjs.org/docs/app/api-reference/file-conventions/error
- https://nextjs.org/docs/app/api-reference/file-conventions/not-found
