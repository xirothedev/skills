/**
 * CORRECT PATTERNS: Suspense-Based Streaming
 *
 * These examples demonstrate production-quality patterns for streaming
 * content in Next.js using Suspense boundaries.
 */

import { Suspense } from 'react'
import Image from 'next/image'

// ============================================================================
// Types
// ============================================================================

interface Post {
  id: string
  title: string
  excerpt: string
  author: { name: string; avatar: string }
  createdAt: Date
}

interface Comment {
  id: string
  content: string
  author: { name: string; avatar: string }
  createdAt: Date
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  followers: number
  following: number
}

// ============================================================================
// Skeleton Fallbacks
// ============================================================================

function PostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse border rounded-lg p-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded mt-3" />
          <div className="h-4 w-2/3 bg-gray-100 rounded mt-2" />
          <div className="flex items-center gap-2 mt-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3 p-3 border rounded">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full" />
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded mt-2" />
        </div>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="flex gap-6">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Async Server Components (fetch their own data)
// ============================================================================

/**
 * Comments component fetches its own data.
 * Wrapped in Suspense at call site for independent streaming.
 */
async function Comments({ postId }: { postId: string }) {
  // Simulated slow query - this component streams when ready
  const comments: Comment[] = await fetch(
    `/api/posts/${postId}/comments`,
    { cache: 'no-store' }
  ).then(res => res.json())

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">
        Comments ({comments.length})
      </h3>
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3 p-3 border rounded">
            <Image
              src={comment.author.avatar}
              alt={comment.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{comment.author.name}</p>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * UserProfile component fetches its own data.
 * Independent Suspense boundary allows it to stream separately.
 */
async function UserProfile({ userId }: { userId: string }) {
  const user: UserProfile = await fetch(
    `/api/users/${userId}`,
    { cache: 'no-store' }
  ).then(res => res.json())

  return (
    <aside className="border rounded-lg p-6">
      <div className="flex items-center gap-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600">{user.bio}</p>
      <div className="flex gap-6 mt-4 text-sm">
        <span><strong>{user.followers}</strong> followers</span>
        <span><strong>{user.following}</strong> following</span>
      </div>
    </aside>
  )
}

/**
 * Sidebar component for nested Suspense demonstration.
 * Streams after main content due to nesting.
 */
async function Sidebar({ category }: { category: string }) {
  const relatedPosts = await fetch(
    `/api/posts/related?category=${category}`,
    { cache: 'no-store' }
  ).then(res => res.json())

  return (
    <aside className="space-y-4">
      <h3 className="font-semibold">Related Posts</h3>
      <ul className="space-y-2 text-sm">
        {relatedPosts.map((post: { id: string; title: string }) => (
          <li key={post.id} className="hover:underline cursor-pointer">
            {post.title}
          </li>
        ))}
      </ul>
    </aside>
  )
}

// ============================================================================
// Page Component with Multiple Suspense Boundaries
// ============================================================================

/**
 * CORRECT: Fast content renders immediately, slow content streams in.
 * Each Suspense boundary is independent.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Fast query - render immediately without Suspense
  const post: Post = await fetch(
    `/api/posts/${id}`,
    { cache: 'no-store' }
  ).then(res => res.json())

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Fast content renders immediately */}
      <article className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 mb-6">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">{post.author.name}</span>
          <time className="text-gray-500">
            {post.createdAt.toLocaleDateString()}
          </time>
        </div>
        <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
      </article>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Slow Comments stream independently */}
        <div className="lg:col-span-2">
          <Suspense fallback={<CommentsSkeleton />}>
            <Comments postId={id} />
          </Suspense>
        </div>

        {/* Slow UserProfile streams independently */}
        <div className="lg:col-span-1">
          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile userId={post.author.name} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

// ============================================================================
// Nested Suspense for Streaming Priority
// ============================================================================

/**
 * CORRECT: Nested Suspense controls streaming order.
 * MainContent streams first, Sidebar streams second.
 */
async function ProductDetails({ productId }: { productId: string }) {
  const product = await fetch(`/api/products/${productId}`).then(res =>
    res.json()
  )

  return (
    <div>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">${product.price}</p>
    </div>
  )
}

export async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Outer Suspense - main content streams first */}
      <Suspense fallback={<PostsSkeleton />}>
        <ProductDetails productId={id} />

        {/* Inner Suspense - sidebar streams after main content */}
        <div className="mt-8">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar category="electronics" />
          </Suspense>
        </div>
      </Suspense>
    </main>
  )
}

// ============================================================================
// Loading Component (alternative approach)
// ============================================================================

/**
 * Alternative: Using loading.tsx for page-level Suspense.
 * Creates automatic Suspense boundary around the page.
 *
 * // app/dashboard/loading.tsx
 * export default function DashboardLoading() {
 *   return <DashboardSkeleton />
 * }
 *
 * // app/dashboard/page.tsx
 * export default async function DashboardPage() {
 *   const data = await getDashboardData() // slow
 *   return <Dashboard data={data} />
 * }
 *
 * Note: loading.tsx creates ONE Suspense boundary for the entire page.
 * For granular streaming, use explicit Suspense boundaries as shown above.
 */