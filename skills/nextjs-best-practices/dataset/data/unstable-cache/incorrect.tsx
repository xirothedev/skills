// Incorrect patterns for unstable_cache (anti-patterns to avoid)

import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

// =============================================================================
// ANTI-PATTERN 1: Using unstable_cache for HTTP fetch
// =============================================================================

// WRONG: Using unstable_cache for fetch instead of native fetch caching
export const getExternalData = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/data')
    return res.json()
  },
  ['external-data']
)

/*
 * PROBLEM: unstable_cache is for computed values, not HTTP requests.
 * Next.js has built-in fetch caching that handles:
 * - Automatic deduplication within a request
 * - Proper cache headers interpretation
 * - Better integration with revalidation
 *
 * CORRECT APPROACH: Use fetch with next options:
 *
 * const res = await fetch('https://api.example.com/data', {
 *   next: { revalidate: 3600, tags: ['external-data'] }
 * })
 */

// =============================================================================
// ANTI-PATTERN 2: Missing cache key dependencies (stale results)
// =============================================================================

// WRONG: productId affects output but isn't in cache key
export const getProductData = (productId: string) =>
  unstable_cache(
    async () => {
      return db.product.findUnique({ where: { id: productId } })
    },
    ['product-data'], // Missing productId from key!
    { revalidate: 3600 }
  )()

/*
 * PROBLEM: Same cache key for different products.
 * Request for product A gets cached, then request for product B
 * returns product A's data because the key doesn't include productId.
 *
 * CORRECT APPROACH: Include all values that affect output in key:
 *
 * unstable_cache(
 *   () => db.product.findUnique({ where: { id: productId } }),
 *   [`product-data-${productId}`], // productId in key
 *   { revalidate: 3600 }
 * )
 */

// =============================================================================
// ANTI-PATTERN 3: Over-caching dynamic/frequently-changing data
// =============================================================================

// WRONG: Caching real-time data that must be fresh
export const getStockPrice = unstable_cache(
  async (symbol: string) => {
    const res = await fetch(`https://api.stocks.com/${symbol}`)
    return res.json()
  },
  ['stock-price'],
  { revalidate: 300 } // 5 minutes is too long for stock prices
)

/*
 * PROBLEM: Stock prices change by the second. 5-minute cache
 * serves dangerously stale financial data.
 *
 * CORRECT APPROACH:
 * - For truly real-time data, don't cache at all or use SWR on client
 * - For data that can be slightly stale, use very short revalidate
 * - Consider streaming or websocket for live updates
 */

// =============================================================================
// ANTI-PATTERN 4: Caching user-specific data (wrong cache scope)
// =============================================================================

// WRONG: unstable_cache is global, not per-user
export const getUserDashboard = unstable_cache(
  async () => {
    const userId = (await headers()).get('x-user-id')
    return db.dashboard.findUnique({ where: { userId } })
  },
  ['user-dashboard'],
  { revalidate: 60 }
)

/*
 * PROBLEM: unstable_cache stores ONE global value.
 * User A's dashboard gets cached, User B sees User A's data!
 * This is a serious security/data leak issue.
 *
 * CORRECT APPROACHES:
 *
 * 1. Don't cache - just fetch per request:
 *    const userId = (await headers()).get('x-user-id')
 *    return db.dashboard.findUnique({ where: { userId } })
 *
 * 2. Include userId in cache key (if caching is needed):
 *    unstable_cache(
 *      () => db.dashboard.findUnique({ where: { userId } }),
 *      [`dashboard-${userId}`], // userId in key!
 *      { revalidate: 60 }
 *    )
 *
 * 3. For per-user data, often better to use client-side state
 *    management or session-based caching
 */

// =============================================================================
// ANTI-PATTERN 5: Caching functions with side effects
// =============================================================================

// WRONG: Cached function has side effects
export const processOrder = unstable_cache(
  async (orderId: string) => {
    const order = await db.order.findUnique({ where: { id: orderId } })

    // SIDE EFFECT: Updates database!
    await db.order.update({
      where: { id: orderId },
      data: { processedAt: new Date() },
    })

    await sendConfirmationEmail(order.userId)

    return order
  },
  ['process-order']
)

/*
 * PROBLEM: Caching a function with side effects means:
 * - Side effects only run once, then cache returns
 * - If cache invalidates, side effects run again (duplicate emails!)
 * - This is semantically wrong - operations should not be cached
 *
 * CORRECT APPROACH: Don't cache operations, only cache reads:
 *
 * // Separate: cache the read
 * const getOrder = unstable_cache(
 *   (id) => db.order.findUnique({ where: { id } }),
 *   ['order']
 * )
 *
 * // Don't cache: the mutation
 * async function processOrder(orderId: string) {
 *   const order = await getOrder(orderId)
 *   await db.order.update({ ... })
 *   await sendConfirmationEmail(order.userId)
 * }
 */

// =============================================================================
// ANTI-PATTERN 6: Not handling errors (cached error propagates)
// =============================================================================

// WRONG: Errors get cached and returned for all subsequent calls
export const getProduct = unstable_cache(
  async (productId: string) => {
    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new Error('Product not found') // This error gets cached!
    }
    return product
  },
  ['product'],
  { revalidate: 3600 }
)

/*
 * PROBLEM: If product doesn't exist, the error gets cached.
 * Even after product is created, cache returns the cached error.
 *
 * CORRECT APPROACH: Handle not-found gracefully, don't throw:
 *
 * unstable_cache(
 *   async (productId: string) => {
 *     return db.product.findUnique({ where: { id: productId } })
 *   },
 *   [`product-${productId}`],
 *   { revalidate: 3600 }
 * )
 *
 * // Caller handles null:
 * const product = await getCachedProduct(id)
 * if (!product) notFound()
 */

// =============================================================================
// ANTI-PATTERN 7: Sync functions passed to unstable_cache
// =============================================================================

// WRONG: unstable_cache expects async function
export const getComputedValue = unstable_cache(
  () => {
    // Synchronous computation - won't be cached properly
    return heavyCalculation(someInput)
  },
  ['computed-value']
)

/*
 * PROBLEM: unstable_cache wraps a Promise. Sync functions
 * won't benefit from caching as expected.
 *
 * CORRECT APPROACH: Wrap sync computation in async:
 *
 * unstable_cache(
 *   async () => heavyCalculation(someInput),
 *   ['computed-value']
 * )
 */

// =============================================================================
// ANTI-PATTERN 8: Using unstable_cache in Client Components
// =============================================================================

// WRONG: unstable_cache is server-only but used in client component
'use client'

import { unstable_cache } from 'next/cache' // Error: can't import in client

export function ClientComponent() {
  const cachedFn = unstable_cache(/* ... */) // Won't work!
  // ...
}

/*
 * PROBLEM: unstable_cache is a server-only API. It cannot be used
 * in Client Components and will throw an error.
 *
 * CORRECT APPROACH:
 * - Use unstable_cache in Server Components or Server Actions
 * - Pass cached data as props to Client Components
 * - For client-side caching, use React Query, SWR, or local state
 */