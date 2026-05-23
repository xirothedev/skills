# Next.js Fetch Caching Strategies

## Overview

Next.js extends the native `fetch()` API with powerful caching options. Choosing the right cache strategy per endpoint prevents stale data and unnecessary server load. There is no one-size-fits-all setting.

## Cache Strategies

| Strategy | Code | Use Case | Behavior |
|----------|------|----------|----------|
| **Cached (default)** | `fetch(url)` | Static content, rarely changes | Cached indefinitely until manual revalidation |
| **Time-based revalidation** | `fetch(url, { next: { revalidate: 3600 } })` | Content that refreshes periodically | Revalidates after specified seconds |
| **No cache** | `fetch(url, { cache: 'no-store' })` | Real-time data, user-specific content | Fetches fresh data on every request |
| **Force static** | `fetch(url, { next: { revalidate: false } })` | Build-time only data | Cached at build time, never revalidates |

## When to Use Each Strategy

### `cache: 'no-store'`
- User-specific data (profiles, preferences, permissions)
- Real-time data (stock prices, live updates, notifications)
- Any data that must never be stale
- POST/PUT/DELETE requests (non-GET methods default to no-store)

### `next: { revalidate: N }`
- Semi-static content (blog posts, product listings, site settings)
- Data that changes on a predictable schedule
- Public content where slight staleness is acceptable
- High-traffic endpoints where caching reduces load

### Default caching (no options)
- Truly static assets
- Third-party API data that rarely changes
- Build-time configuration

### `React.cache()`
- Cross-request deduplication within same render tree
- Avoiding duplicate database queries
- Shared data fetched in multiple components
- Request-level memoization (not persistent across requests)

## Key Rules

1. **Default is aggressive**: `fetch()` without options caches indefinitely in production
2. **Route-level fallback**: `export const revalidate` in a page/layout applies to all fetches in that route
3. **Granular overrides**: Individual fetch options override route-level settings
4. **React.cache() is separate**: It deduplicates within a request, not across requests
5. **Dynamic routes**: Use `generateStaticParams` for static generation with dynamic segments
6. **Revalidation API**: Use `revalidatePath()` or `revalidateTag()` for on-demand cache invalidation

## Common Pitfalls

- Forgetting cache strategy on user-specific endpoints → stale personalized data
- Using `no-store` everywhere → unnecessary load on origin servers
- Mixing `revalidate` with `no-store` → `no-store` wins, revalidate ignored
- Expecting `React.cache()` to persist across requests → only works within single render

## References

- https://nextjs.org/docs/app/building-your-application/caching
- https://nextjs.org/docs/app/api-reference/functions/fetch