/**
 * Anti-Patterns: Revalidation Mistakes in Next.js
 * Each example demonstrates a common mistake and explains the problem.
 */

// =============================================================================
// ANTI-PATTERN 1: No Revalidation - Data Cached Forever
// =============================================================================

// app/blog/page.tsx
// PROBLEM: Without revalidate export, this page is cached indefinitely.
// The blog list will never show new posts until the cache is manually cleared
// or the deployment is redeployed.

interface Post {
  id: string
  title: string
  excerpt: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts')
  // This fetch is cached forever in the default Next.js data cache
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
// NO REVALIDATION EXPORT - Data is permanently stale

// =============================================================================
// ANTI-PATTERN 2: Missing Revalidation After Mutations
// =============================================================================

// app/blog/actions.ts
'use server'

import { db } from '@/lib/db'

interface PostData {
  title: string
  content: string
  authorId: string
}

// PROBLEM: The mutation succeeds, but the cached blog list is never updated.
// Users will still see the old data until the cache expires (if it has time-based
// revalidation) or forever (if no revalidation is configured).

export async function createPost(data: PostData) {
  const post = await db.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    },
  })

  // MISSING: revalidatePath('/blog') or revalidateTag('posts')
  // The cache is now inconsistent with the database

  return post
}

// =============================================================================
// ANTI-PATTERN 3: Using revalidatePath for Single-Item Updates
// =============================================================================

// app/blog/[id]/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

interface PostData {
  title?: string
  content?: string
}

// PROBLEM: Updating one post invalidates ALL cached data under /blog.
// This is inefficient when the blog has hundreds of posts - we only need
// to invalidate the specific post that changed, not everything.
// Use revalidateTag with a post-specific tag for granular invalidation.

export async function updatePost(id: string, data: Partial<PostData>) {
  const post = await db.post.update({
    where: { id },
    data,
  })

  // OVER-INVALIDATION: This clears cache for the entire /blog subtree
  // including the blog list, all individual post pages, and any other
  // cached data under /blog - even though only one post changed.
  revalidatePath('/blog')

  return post
}

// CORRECT APPROACH: Use tag-based invalidation
//
// export async function updatePost(id: string, data: Partial<PostData>) {
//   const post = await db.post.update({
//     where: { id },
//     data,
//   })
//
//   // Precise invalidation - only the specific post
//   revalidateTag(`post-${id}`)
//
//   return post
// }

// =============================================================================
// ANTI-PATTERN 4: Inconsistent Tag Taxonomy
// =============================================================================

// lib/api.ts
// PROBLEM: Fetch calls use inconsistent tag naming, making revalidation
// unreliable. Some use 'posts', others use 'post-list', and some don't
// use tags at all.

export async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  })
  return res.json()
}

export async function getFeaturedPosts() {
  const res = await fetch('https://api.example.com/posts?featured=true', {
    next: { tags: ['post-list'] }, // Different tag - inconsistent!
  })
  return res.json()
}

export async function getRecentPosts() {
  const res = await fetch('https://api.example.com/posts?recent=true', {
    // NO TAG - won't be invalidated when posts change
  })
  return res.json()
}

// In the server action:
export async function createPost(data: PostData) {
  const post = await db.post.create({ data })

  revalidateTag('posts') // Only invalidates getPosts(), not getFeaturedPosts()
  // getRecentPosts() is never invalidated

  return post
}

// CORRECT APPROACH: Use a consistent tag taxonomy
//
// export const CACHE_TAGS = {
//   posts: 'posts', // All post-related fetches use this
//   post: (id: string) => `post-${id}`,
// } as const
//
// export async function getPosts() {
//   const res = await fetch('https://api.example.com/posts', {
//     next: { tags: [CACHE_TAGS.posts] },
//   })
//   return res.json()
// }
//
// export async function getFeaturedPosts() {
//   const res = await fetch('https://api.example.com/posts?featured=true', {
//     next: { tags: [CACHE_TAGS.posts] }, // Same tag
//   })
//   return res.json()
// }
//
// export async function getRecentPosts() {
//   const res = await fetch('https://api.example.com/posts?recent=true', {
//     next: { tags: [CACHE_TAGS.posts] }, // Same tag
//   })
//   return res.json()
// }

// =============================================================================
// ANTI-PATTERN 5: Revalidating Non-Existent Paths
// =============================================================================

// app/blog/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

// PROBLEM: Attempting to revalidate a path that doesn't exist in the app.
// This silently does nothing - the cache is never invalidated.
// Always ensure the path matches an actual route in your application.

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })

  // WRONG PATH: Assuming posts are at /posts but they're actually at /blog
  revalidatePath('/posts') // This path doesn't exist in the app

  // Also wrong: dynamic path without the actual id
  revalidatePath('/blog/[id]') // Literal string, not interpolated

  // CORRECT: revalidatePath('/blog')
  // CORRECT: revalidatePath(`/blog/${id}`)
}

// =============================================================================
// ANTI-PATTERN 6: Mutations Without Error Handling for Revalidation
// =============================================================================

// app/blog/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

// PROBLEM: If the mutation fails, revalidation still runs, potentially
// clearing valid cached data. Worse, if revalidation fails, the mutation
// already succeeded but the user sees stale data.

export async function createPost(data: PostData) {
  const post = await db.post.create({ data })

  // If this throws, post was created but cache wasn't invalidated
  revalidatePath('/blog')

  return post
}

// CORRECT APPROACH: Handle errors appropriately
//
// export async function createPost(data: PostData) {
//   try {
//     const post = await db.post.create({ data })
//
//     // Invalidate after successful mutation
//     revalidatePath('/blog')
//
//     return { success: true, post }
//   } catch (error) {
//     // Don't invalidate if mutation failed
//     console.error('Failed to create post:', error)
//     return { success: false, error: 'Failed to create post' }
//   }
// }

// =============================================================================
// ANTI-PATTERN 7: Client-Side Revalidation Attempt
// =============================================================================

// components/PostForm.tsx
'use client'

import { revalidatePath } from 'next/cache' // ERROR: Can't import in client

// PROBLEM: revalidatePath and revalidateTag only work in Server Actions
// and Server Components. They cannot be called from client components.

export function PostForm() {
  const handleSubmit = async (formData: FormData) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      // This will throw an error - can't use revalidatePath in client
      revalidatePath('/blog') // ERROR!
    }
  }

  return <form action={handleSubmit}>{/* form fields */}</form>
}

// CORRECT APPROACH: Call a Server Action from the client component
//
// // app/blog/actions.ts
// 'use server'
// import { revalidatePath } from 'next/cache'
//
// export async function createPostAndRevalidate(data: PostData) {
//   const post = await db.post.create({ data })
//   revalidatePath('/blog')
//   return post
// }
//
// // components/PostForm.tsx
// 'use client'
// import { createPostAndRevalidate } from '@/app/blog/actions'
//
// export function PostForm() {
//   const handleSubmit = async (formData: FormData) => {
//     await createPostAndRevalidate({
//       title: formData.get('title') as string,
//       content: formData.get('content') as string,
//       authorId: 'user-123',
//     })
//   }
//
//   return <form action={handleSubmit}>{/* form fields */}</form>
// }