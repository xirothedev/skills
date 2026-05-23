// Correct patterns for unstable_cache

import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'

// =============================================================================
// Example 1: Caching expensive database queries
// =============================================================================

interface ProductStats {
  totalSales: number
  averageRating: number
  topCategories: string[]
}

// Expensive aggregation query that should be cached
async function computeProductStats(productId: string): Promise<ProductStats> {
  // Complex database aggregation
  const sales = await db.order.aggregate({
    where: { productId },
    _sum: { amount: true },
  })

  const ratings = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
  })

  // Heavy computation simulated
  const totalSales = sales._sum.amount ?? 0
  const averageRating = ratings._avg.rating ?? 0

  // Derive top categories from review data
  const reviews = await db.review.findMany({
    where: { productId },
    select: { category: true },
  })
  const topCategories = [...new Set(reviews.map(r => r.category).filter(Boolean))]

  return { totalSales, averageRating, topCategories }
}

// Cached version with proper key and tag
export const getCachedProductStats = (productId: string) =>
  unstable_cache(
    () => computeProductStats(productId),
    [`product-stats-${productId}`], // Unique key per product
    {
      tags: [`product-${productId}-stats`], // For targeted revalidation
      revalidate: 3600, // 1 hour
    }
  )()

// =============================================================================
// Example 2: Caching derived/computed data
// =============================================================================

interface SearchIndex {
  products: Map<string, string[]>
  lastUpdated: number
}

async function buildSearchIndex(): Promise<SearchIndex> {
  const products = await db.product.findMany({
    select: { id: true, name: true, description: true },
  })

  // Expensive text processing
  const index = new Map<string, string[]>()
  for (const product of products) {
    // Simple tokenization: split on whitespace, lowercase
    const tokens = `${product.name} ${product.description}`.toLowerCase().split(/\s+/).filter(Boolean)
    for (const token of tokens) {
      const existing = index.get(token) ?? []
      existing.push(product.id)
      index.set(token, existing)
    }
  }

  return {
    products: index,
    lastUpdated: Date.now(),
  }
}

export const getCachedSearchIndex = unstable_cache(
  buildSearchIndex,
  ['search-index'],
  {
    tags: ['search-index'],
    revalidate: false, // Manual revalidation only
  }
)

// Server Action to rebuild index
export async function rebuildSearchIndex() {
  'use server'
  await revalidateTag('search-index')
}

// =============================================================================
// Example 3: Prefer fetch cache for HTTP requests
// =============================================================================

// WRONG: Don't use unstable_cache for fetch
// const getCachedData = unstable_cache(
//   () => fetch('https://api.example.com/data').then(r => r.json()),
//   ['external-data']
// )

// RIGHT: Use fetch with cache options
export async function getExternalData() {
  const res = await fetch('https://api.example.com/data', {
    next: {
      revalidate: 3600, // 1 hour
      tags: ['external-data'],
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

// =============================================================================
// Example 4: Multiple dependent values in cache key
// =============================================================================

interface ReportData {
  period: string
  metrics: Record<string, number>
  comparisons: Record<string, number>
}

async function generateReport(
  orgId: string,
  period: 'week' | 'month' | 'quarter',
  year: number
): Promise<ReportData> {
  // Compute date range for the period
  const startMonth = period === 'week' ? 0 : period === 'month' ? 0 : 0 // simplify
  const monthCount = period === 'week' ? 1 : period === 'month' ? 1 : 3
  const startDate = new Date(year, startMonth, 1)
  const endDate = new Date(year, startMonth + monthCount, 0)

  // Expensive report generation
  const metrics = await db.metric.findMany({
    where: {
      organizationId: orgId,
      timestamp: { gte: startDate, lte: endDate },
    },
  })

  // Aggregate: sum values by key
  const aggregated: Record<string, number> = {}
  for (const m of metrics) {
    aggregated[m.key] = (aggregated[m.key] ?? 0) + m.value
  }

  // Compare with previous period (simplified)
  const comparisons: Record<string, number> = {}
  for (const [key, value] of Object.entries(aggregated)) {
    comparisons[key] = value * 0.9 // placeholder: -10% vs prior period
  }

  return {
    period: `${period}-${year}`,
    metrics: aggregated,
    comparisons,
  }
}

// All values affecting output are in the key
export const getCachedReport = (
  orgId: string,
  period: 'week' | 'month' | 'quarter',
  year: number
) =>
  unstable_cache(
    () => generateReport(orgId, period, year),
    [`report-${orgId}-${period}-${year}`], // All dependencies in key
    {
      tags: [`report-${orgId}`],
      revalidate: 86400, // 24 hours
    }
  )()

// =============================================================================
// Example 5: Function that combines fetch and computation
// =============================================================================

interface EnrichedProduct {
  id: string
  name: string
  price: number
  availability: string
  priceHistory: number[]
}

async function enrichProductData(productId: string): Promise<EnrichedProduct> {
  // Use fetch cache for HTTP
  const [baseRes, historyRes] = await Promise.all([
    fetch(`https://api.supplier.com/products/${productId}`, {
      next: { revalidate: 300, tags: [`product-${productId}`] },
    }),
    fetch(`https://api.supplier.com/products/${productId}/history`, {
      next: { revalidate: 3600 },
    }),
  ])

  const base = await baseRes.json()
  const history = await historyRes.json()

  // Compute availability from stock data
  const availability = base.stock > 0
    ? (base.shipping === 'express' ? 'In stock — ships today' : 'In stock')
    : 'Out of stock'

  // Simple price trend: extract recent prices
  const processedHistory = (history.prices as { date: string; price: number }[])
    .slice(-12)
    .map(p => p.price)

  return {
    id: productId,
    name: base.name,
    price: base.price,
    availability,
    priceHistory: processedHistory,
  }
}

// Cache the computation result (fetches are cached separately)
export const getCachedEnrichedProduct = (productId: string) =>
  unstable_cache(
    () => enrichProductData(productId),
    [`enriched-product-${productId}`],
    {
      tags: [`enriched-${productId}`],
      revalidate: 300, // 5 minutes
    }
  )()