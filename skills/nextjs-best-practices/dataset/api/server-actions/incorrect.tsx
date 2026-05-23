// Incorrect: API route for form mutation instead of Server Action
// app/create-post/page.tsx (WRONG — client-side fetch to API route)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreatePostForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // WRONG: Manual fetch to API route for simple mutation
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      setError('Failed to create post')
      return
    }

    router.push('/posts')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Create</button>
    </form>
  )
}

// Problems:
// 1. Extra boilerplate — fetch, error state, JSON serialization
// 2. No built-in CSRF protection — API routes need manual CSRF setup
// 3. Client-side only — doesn't work without JavaScript
// 4. Manual revalidation — need to call router.refresh() or mutate cache
// 5. More code paths — form handler + API route + validation in two places
// 6. Slower — extra round trip: client → API route → database

// ---
// app/api/posts/route.ts (unnecessary API layer)
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Validation duplicated — also needed in client
  if (!body.title) {
    return new Response('Title required', { status: 400 })
  }

  await db.post.create({ data: body })
  return NextResponse.json({ success: true }, { status: 201 })
}

// Problems:
// 1. Extra layer — Server Action does this more directly
// 2. Validation in two places (client + API)
// 3. No automatic revalidation — must call revalidatePath manually
// 4. CSRF vulnerability — API routes need explicit protection
