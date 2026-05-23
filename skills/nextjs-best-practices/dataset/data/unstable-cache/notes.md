# unstable_cache Dataset

Use this case when deciding whether to use `unstable_cache` from `next/cache`.

## What is unstable_cache?

`unstable_cache` is an experimental API for caching the results of expensive computations in Next.js. It wraps a function and caches its return value.

**Version scope:** Next.js 14.x - 16.x (experimental/unstable)

## When to use it

- Caching results of expensive computations (database queries, calculations, transformations)
- Deduplicating repeated calls within a request
- Persisting computed results across requests

## When NOT to use it

- HTTP fetch requests — use `fetch()` with `next` options instead
- User-specific data — cache is not scoped per-user
- Highly dynamic data that must always be fresh
- Simple operations where caching overhead outweighs benefit

## Key differences from fetch caching

| Feature | unstable_cache | fetch cache |
|---------|---------------|-------------|
| Use case | Computed values | HTTP requests |
| Cache keys | Manual via tags | Automatic from URL |
| Revalidation | Time-based or tag-based | Same |
| Scope | Request + data cache | Data cache only |

## Cache key generation

Always include all values that affect the output in your cache key:

```tsx
// Correct: cache key includes all dependencies
const cachedCompute = unstable_cache(
  async (id: string) => computeExpensive(id),
  ['compute', id], // id is part of the key
  { tags: ['compute-data'] }
)
```

## API Signature

```tsx
import { unstable_cache } from 'next/cache'

unstable_cache(
  fn: () => Promise<T>,      // Function to cache
  keys: string[],            // Cache key parts
  options?: {
    tags?: string[],         // For tag-based revalidation
    revalidate?: number | false  // Time in seconds, or false
  }
): () => Promise<T>
```