/**
 * ANTI-PATTERN: Using <a> tags instead of <Link>
 *
 * Problem: Native anchor tags bypass Next.js routing entirely.
 * - No automatic prefetching when entering viewport
 * - Full page reload on click (loses SPA experience)
 * - No route caching or client-side navigation benefits
 * - Slower perceived performance for users
 */
export function NavigationWithAnchorTags() {
  return (
    <nav>
      {/* Wrong: No prefetch, full page reload */}
      <a href="/about">About</a>
      <a href="/products">Products</a>
      <a href="/contact">Contact</a>
    </nav>
  )
}

/**
 * ANTI-PATTERN: Over-prefetching with prefetch={true}
 *
 * Problem: Explicitly enabling prefetch on every link is wasteful.
 * - Default behavior already prefetches in viewport
 * - prefetch={true} is redundant and misleading
 * - Can cause excessive network requests for rarely-used routes
 * - Wastes bandwidth on routes users never visit
 */
export function OverPrefetching() {
  return (
    <nav>
      {/* Wrong: prefetch={true} is redundant (already default) */}
      <Link href="/about" prefetch={true}>About</Link>

      {/* Wrong: Wasteful for rare destinations */}
      <Link href="/admin/deep/settings" prefetch={true}>
        Deep Admin Settings
      </Link>

      {/* Wrong: Heavy route prefetched unnecessarily */}
      <Link href="/export/full-database" prefetch={true}>
        Export Database
      </Link>
    </nav>
  )
}

import Link from 'next/link'

/**
 * ANTI-PATTERN: Missing prefetch optimization for critical paths
 *
 * Problem: Not leveraging prefetch for high-traffic navigation.
 * - Critical user flows feel slower
 * - Missed opportunity for instant navigation
 * - Poor user experience on frequently accessed routes
 */
export function MissedPrefetchOpportunity() {
  return (
    <nav>
      {/* Wrong: Using <a> for a critical navigation path */}
      <a href="/checkout">Checkout</a>

      {/* Wrong: Disabling prefetch for a popular route */}
      <Link href="/products" prefetch={false}>
        Products
      </Link>

      {/* Wrong: No prefetch for the main CTA */}
      <a href="/signup">Sign Up</a>
    </nav>
  )
}

/**
 * ANTI-PATTERN: Mixing approaches inconsistently
 *
 * Problem: Inconsistent navigation behavior confuses users and degrades UX.
 * - Some routes feel instant, others reload the page
 * - Unpredictable performance
 * - Harder to debug navigation issues
 */
export function InconsistentNavigation() {
  return (
    <nav>
      <Link href="/home">Home</Link>
      <a href="/about">About</a>
      <Link href="/contact">Contact</Link>
      <a href="/blog">Blog</a>
    </nav>
  )
}