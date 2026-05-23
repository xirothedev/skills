/**
 * ANTI-PATTERNS: What NOT to do with Suspense and Streaming
 *
 * Each example demonstrates a common mistake and explains why it hurts
 * performance and user experience.
 */

import { Suspense, useState, useEffect } from 'react'

// ============================================================================
// ANTI-PATTERN 1: Sequential Data Fetching (Waterfall)
// ============================================================================

/**
 * PROBLEM: All data is awaited sequentially before ANY rendering.
 *
 * The user sees nothing until the slowest query completes.
 * Even if posts load in 100ms, the user waits for comments (2s) and
 * user profile (3s) before seeing anything.
 *
 * Total wait time: 100ms + 2s + 3s = 5.1 seconds
 */
export default async function PageAntiPattern1({
  params,
}: {
  params: { id: string }
}) {
  // Sequential awaits - waterfall blocking
  const posts = await fetch('/api/posts').then(res => res.json()) // 100ms
  const comments = await fetch(`/api/posts/${params.id}/comments`).then(res =>
    res.json()
  ) // 2s
  const userProfile = await fetch('/api/user/profile').then(res =>
    res.json()
  ) // 3s

  // Nothing renders until ALL data is ready
  return (
    <main>
      <section>
        {posts.map((post: { id: string; title: string }) => (
          <article key={post.id}>{post.title}</article>
        ))}
      </section>
      <section>
        {comments.map((comment: { id: string; content: string }) => (
          <div key={comment.id}>{comment.content}</div>
        ))}
      </section>
      <aside>
        <h3>{userProfile.name}</h3>
        <p>{userProfile.bio}</p>
      </aside>
    </main>
  )
}

// BETTER: Parallel fetching with Promise.all (still no streaming)
export default async function PageSlightlyBetter() {
  // Parallel but still blocks rendering
  const [posts, comments, userProfile] = await Promise.all([
    fetch('/api/posts').then(res => res.json()),
    fetch('/api/comments').then(res => res.json()),
    fetch('/api/user/profile').then(res => res.json()),
  ])

  return (
    <main>
      {/* All or nothing - still waits for slowest */}
    </main>
  )
}

// BEST: Suspense boundaries for independent streaming
// (See correct.tsx for this pattern)

// ============================================================================
// ANTI-PATTERN 2: Single loading.tsx for Entire Page
// ============================================================================

/**
 * PROBLEM: One loading.tsx creates all-or-nothing experience.
 *
 * // app/dashboard/loading.tsx
 * export default function Loading() {
 *   return <DashboardSkeleton />
 * }
 *
 * // app/dashboard/page.tsx (below)
 *
 * User sees full skeleton until ALL data resolves.
 * No progressive disclosure - fast content waits for slow content.
 */
export default async function DashboardPageAntiPattern() {
  // Even though these could stream independently...
  const stats = await fetch('/api/dashboard/stats').then(res => res.json()) // fast: 200ms
  const revenue = await fetch('/api/dashboard/revenue').then(res =>
    res.json()
  ) // medium: 1s
  const activity = await fetch('/api/dashboard/activity').then(res =>
    res.json()
  ) // slow: 5s

  // ...the single loading.tsx blocks until everything is ready
  return (
    <main className="p-8">
      <h1>Dashboard</h1>
      <StatsGrid data={stats} />
      <RevenueChart data={revenue} />
      <ActivityFeed data={activity} />
    </main>
  )
}

function StatsGrid({ data }: { data: unknown }) {
  return <div>Stats: {JSON.stringify(data)}</div>
}

function RevenueChart({ data }: { data: unknown }) {
  return <div>Revenue: {JSON.stringify(data)}</div>
}

function ActivityFeed({ data }: { data: unknown }) {
  return <div>Activity: {JSON.stringify(data)}</div>
}

/**
 * BETTER: Wrap each section in its own Suspense boundary.
 * Stats show after 200ms, revenue after 1s, activity after 5s.
 * User gets value progressively instead of waiting 5s for everything.
 */

// ============================================================================
// ANTI-PATTERN 3: No Suspense Boundaries (Slowest Wins)
// ============================================================================

/**
 * PROBLEM: Without Suspense boundaries, the slowest query determines
 * when the user sees ANYTHING.
 *
 * Even with parallel fetching, React waits for all promises before
 * streaming the page. This defeats the purpose of Server Components.
 */
async function getProducts() {
  return fetch('/api/products').then(res => res.json()) // 100ms
}

async function getReviews() {
  return fetch('/api/reviews').then(res => res.json()) // 3s
}

async function getRecommendations() {
  return fetch('/api/recommendations').then(res => res.json()) // 5s
}

export default async function ProductsPageAntiPattern() {
  // Parallel fetching, but no streaming
  const [products, reviews, recommendations] = await Promise.all([
    getProducts(),
    getReviews(),
    getRecommendations(),
  ])

  // User waits 5 seconds (slowest) before seeing ANYTHING
  // Products that loaded in 100ms are blocked by recommendations
  return (
    <main>
      <ProductList products={products} />
      <ReviewsList reviews={reviews} />
      <RecommendationsCarousel recommendations={recommendations} />
    </main>
  )
}

function ProductList({ products }: { products: unknown[] }) {
  return <div>Products: {products.length}</div>
}

function ReviewsList({ reviews }: { reviews: unknown[] }) {
  return <div>Reviews: {reviews.length}</div>
}

function RecommendationsCarousel({ recommendations }: { recommendations: unknown[] }) {
  return <div>Recommendations: {recommendations.length}</div>
}

/**
 * BETTER: Wrap each section in Suspense.
 * Products stream after 100ms, reviews after 3s, recommendations after 5s.
 * User can start interacting with products immediately.
 */

// ============================================================================
// ANTI-PATTERN 4: Client-Side Loading States for Server Components
// ============================================================================

/**
 * PROBLEM: Using useState/useEffect for loading in Server Components.
 *
 * Server Components already support streaming via Suspense.
 * Adding client-side state defeats the purpose and increases bundle size.
 */
function CommentsAntiPattern({ postId }: { postId: string }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // This is a client component making a fetch
    // No streaming, no progressive rendering
    fetch(`/api/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [postId])

  if (loading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments</div>

  return (
    <div>
      {comments.map((comment: { id: string; content: string }) => (
        <div key={comment.id}>{comment.content}</div>
      ))}
    </div>
  )
}

/**
 * WHY THIS IS BAD:
 *
 * 1. No streaming - entire component loads at once after fetch completes
 * 2. Increased bundle size - useState/useEffect require 'use client' directive
 * 3. No SEO benefit - content loaded client-side isn't in initial HTML
 * 4. Slower perceived performance - no progressive rendering
 * 5. More complex code - error handling, loading states, cleanup
 *
 * BETTER: Use async Server Component with Suspense
 *
 * async function Comments({ postId }: { postId: string }) {
 *   const comments = await fetch(`/api/posts/${postId}/comments`).then(res => res.json())
 *   return <CommentList comments={comments} />
 * }
 *
 * // Parent:
 * <Suspense fallback={<CommentsSkeleton />}>
 *   <Comments postId={postId} />
 * </Suspense>
 */

// ============================================================================
// ANTI-PATTERN 5: Oversized Suspense Boundaries
// ============================================================================

/**
 * PROBLEM: Wrapping too much in a single Suspense boundary.
 *
 * The entire main section is blocked by the slowest inner component.
 * If ProductDetails is fast but RelatedProducts is slow, user sees
 * the skeleton for the whole main section.
 */
export default async function ProductPageAntiPattern5({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      {/* Too coarse - one slow component blocks everything */}
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded mt-4" />
            <div className="h-32 w-full bg-gray-100 rounded mt-8" />
          </div>
        }
      >
        {/* ProductDetails: fast (200ms) */}
        <ProductDetails productId={params.id} />

        {/* RelatedProducts: slow (4s) - blocks ProductDetails from showing */}
        <RelatedProducts productId={params.id} />
      </Suspense>
    </main>
  )
}

async function ProductDetails({ productId }: { productId: string }) {
  const product = await fetch(`/api/products/${productId}`).then(res =>
    res.json()
  ) // fast
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

async function RelatedProducts({ productId }: { productId: string }) {
  const related = await fetch(`/api/products/${productId}/related`).then(
    res => res.json()
  ) // slow
  return (
    <div className="mt-8">
      <h2>Related Products</h2>
      {/* ... */}
    </div>
  )
}

/**
 * BETTER: Separate Suspense boundaries for different loading priorities
 *
 * <main>
 *   <Suspense fallback={<ProductSkeleton />}>
 *     <ProductDetails productId={params.id} />
 *   </Suspense>
 *
 *   <Suspense fallback={<RelatedSkeleton />}>
 *     <RelatedProducts productId={params.id} />
 *   </Suspense>
 * </main>
 */

// ============================================================================
// ANTI-PATTERN 6: Missing Error Boundaries
// ============================================================================

/**
 * PROBLEM: Suspense without error handling.
 *
 * If a streaming component throws, the user sees a broken page
 * or unhelpful error. Wrap Suspense in ErrorBoundary for resilience.
 */
export default async function PageWithoutErrorBoundary() {
  return (
    <main>
      <h1>My Page</h1>

      {/* If this fails, entire page breaks */}
      <Suspense fallback={<div>Loading...</div>}>
        <UnstableComponent />
      </Suspense>
    </main>
  )
}

async function UnstableComponent() {
  const data = await fetch('/api/unstable-endpoint').then(res => res.json())
  // If this fetch fails, no graceful fallback
  return <div>{data.content}</div>
}

/**
 * BETTER: Wrap Suspense in ErrorBoundary (client component)
 *
 * // components/ErrorBoundary.tsx (client component)
 * export class ErrorBoundary extends React.Component {
 *   state = { hasError: false }
 *
 *   static getDerivedStateFromError() {
 *     return { hasError: true }
 *   }
 *
 *   render() {
 *     if (this.state.hasError) {
 *       return this.props.fallback
 *     }
 *     return this.props.children
 *   }
 * }
 *
 * // usage:
 * <ErrorBoundary fallback={<CommentsError />}>
 *   <Suspense fallback={<CommentsSkeleton />}>
 *     <Comments />
 *   </Suspense>
 * </ErrorBoundary>
 */

// ============================================================================
// SUMMARY OF PROBLEMS
// ============================================================================

/**
 * 1. Sequential awaits: Waterfall blocking, no parallel loading
 * 2. Single loading.tsx: All-or-nothing, no progressive disclosure
 * 3. No Suspense: Slowest query wins, defeats streaming
 * 4. Client-side state: No streaming, larger bundle, worse SEO
 * 5. Oversized boundaries: Fast content blocked by slow content
 * 6. Missing error boundaries: No graceful degradation on failures
 *
 * KEY INSIGHT: Suspense enables streaming SSR. Without proper boundaries,
 * you're back to all-or-nothing rendering.
 */