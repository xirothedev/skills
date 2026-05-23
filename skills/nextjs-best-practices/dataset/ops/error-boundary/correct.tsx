// Correct: error.tsx with reset functionality and error logging
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'
import { captureException } from '@sentry/nextjs'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service
    captureException(error, { tags: { digest: error.digest } })
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong loading the dashboard</h2>
      <p className="error-message">{error.message}</p>
      {error.digest && (
        <p className="error-digest">Error ID: {error.digest}</p>
      )}
      <div className="error-actions">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/dashboard" className="btn-secondary">
          Go to dashboard
        </a>
      </div>
    </div>
  )
}

// ---
// app/global-error.tsx — Catches root layout errors
'use client'

import { useEffect } from 'react'
import { captureException } from '@sentry/nextjs'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error, { level: 'fatal' })
  }, [error])

  return (
    // global-error.tsx must include html and body tags
    <html lang="en">
      <body>
        <div className="global-error">
          <h1>Application Error</h1>
          <p>A critical error occurred. Please reload the application.</p>
          {error.digest && <p>Error ID: {error.digest}</p>}
          <button onClick={reset}>Reload Application</button>
        </div>
      </body>
    </html>
  )
}

// ---
// app/posts/[id]/page.tsx — Using notFound() for expected 404s
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PostView } from './post-view'

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    notFound() // Triggers not-found.tsx
  }

  return <PostView post={post} />
}

// ---
// app/posts/[id]/not-found.tsx — Custom 404 for this route
import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="not-found">
      <h2>Post Not Found</h2>
      <p>The post you're looking for doesn't exist or has been deleted.</p>
      <Link href="/posts">Browse all posts</Link>
    </div>
  )
}

// ---
// app/not-found.tsx — Global 404 page
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found-global">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}