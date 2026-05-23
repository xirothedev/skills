/**
 * Correct Revalidation Patterns in Next.js
 * Demonstrates time-based, path-based, and tag-based revalidation strategies.
 */

// =============================================================================
// Time-Based Revalidation: Route-Level Export
// =============================================================================

// app/blog/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds

interface Post {
  id: string
  title: string
  excerpt: string
  publishedAt: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts')
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
            <time>{post.publishedAt}</time>
          </li>
        ))}
      </ul>
    </main>
  )
}

// =============================================================================
// Time-Based Revalidation: Per-Request Configuration
// =============================================================================

// lib/api.ts
interface Product {
  id: string
  name: string
  price: number
  inventory: number
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 300 }, // 5 minutes
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 }, // 1 minute (more frequent for individual items)
  })
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

// =============================================================================
// On-Demand Revalidation: Path-Based After Server Action Mutation
// =============================================================================

// app/blog/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface PostData {
  title: string
  content: string
  authorId: string
}

export async function createPost(data: PostData) {
  const post = await db.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    },
  })

  // Invalidate the blog list page after creating a new post
  revalidatePath('/blog')

  return post
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })

  // Invalidate both list and individual post page
  revalidatePath('/blog')
  revalidatePath(`/blog/${id}`)
}

export async function updatePost(id: string, data: Partial<PostData>) {
  const post = await db.post.update({
    where: { id },
    data,
  })

  // Invalidate the specific post page and the list
  revalidatePath('/blog')
  revalidatePath(`/blog/${id}`)

  redirect(`/blog/${id}`)
}

// =============================================================================
// Tag-Based Revalidation: Granular Cache Invalidation
// =============================================================================

// lib/posts.ts
import { revalidateTag } from 'next/cache'

export const CACHE_TAGS = {
  posts: 'posts',
  post: (id: string) => `post-${id}`,
  userPosts: (userId: string) => `user-posts-${userId}`,
} as const

export async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: [CACHE_TAGS.posts] },
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [CACHE_TAGS.post(id)] },
  })
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export async function getUserPosts(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}/posts`, {
    next: { tags: [CACHE_TAGS.userPosts(userId), CACHE_TAGS.posts] },
  })
  if (!res.ok) throw new Error('Failed to fetch user posts')
  return res.json()
}

// app/blog/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/posts'
import { db } from '@/lib/db'

interface PostData {
  title: string
  content: string
  authorId: string
}

export async function createPost(data: PostData) {
  const post = await db.post.create({ data })

  // Invalidate all posts list
  revalidateTag(CACHE_TAGS.posts)
  // Also invalidate the user's posts if tracking separately
  revalidateTag(CACHE_TAGS.userPosts(data.authorId))

  return post
}

export async function updatePost(id: string, data: Partial<PostData>, authorId: string) {
  const post = await db.post.update({
    where: { id },
    data,
  })

  // Precise invalidation: only the specific post
  revalidateTag(CACHE_TAGS.post(id))
  // Also invalidate lists that might contain this post
  revalidateTag(CACHE_TAGS.posts)
  revalidateTag(CACHE_TAGS.userPosts(authorId))

  return post
}

export async function deletePost(id: string, authorId: string) {
  await db.post.delete({ where: { id } })

  // Invalidate all relevant caches
  revalidateTag(CACHE_TAGS.post(id))
  revalidateTag(CACHE_TAGS.posts)
  revalidateTag(CACHE_TAGS.userPosts(authorId))
}

// =============================================================================
// Combining Time-Based and On-Demand Revalidation
// =============================================================================

// app/dashboard/page.tsx
// Use time-based as baseline, on-demand for immediate updates

export const revalidate = 3600 // 1 hour baseline

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  revenue: number
}

async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('https://api.example.com/dashboard/stats', {
    next: {
      revalidate: 300, // 5 minutes (overrides route-level)
      tags: ['dashboard-stats']
    },
  })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <main>
      <h1>Dashboard</h1>
      <dl>
        <dt>Total Users</dt>
        <dd>{stats.totalUsers}</dd>
        <dt>Active Users</dt>
        <dd>{stats.activeUsers}</dd>
        <dt>Revenue</dt>
        <dd>${stats.revenue.toLocaleString()}</dd>
      </dl>
    </main>
  )
}

// app/dashboard/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function refreshDashboardStats() {
  // Force immediate refresh when user explicitly requests it
  revalidateTag('dashboard-stats')
}