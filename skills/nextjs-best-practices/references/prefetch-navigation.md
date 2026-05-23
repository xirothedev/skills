---
title: Leverage Automatic Prefetching
impact: MEDIUM-HIGH
impactDescription: Improves perceived performance by pre-loading navigation targets
tags: prefetching, navigation, performance
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: perf/prefetch-navigation
---

## Leverage Automatic Prefetching

Next.js automatically prefetches linked routes when they enter the viewport. Use `<Link>` components (not `<a>` tags) to benefit from this behavior.

**Incorrect (uses <a> tag, no prefetching):**

```tsx
export function Navigation() {
  return (
    <nav>
      <a href="/about">About</a>       {/* No prefetch */}
      <a href="/contact">Contact</a>   {/* No prefetch */}
    </nav>
  )
}
```

**Correct (uses <Link> with automatic prefetch):**

```tsx
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>     {/* Prefetches when visible */}
      <Link href="/contact">Contact</Link> {/* Prefetches when visible */}
    </nav>
  )
}
```

For links that should NOT prefetch (e.g., rare destinations), set `prefetch={false}`:

```tsx
<Link href="/admin" prefetch={false}>Admin</Link>
```

Next.js 16 adds incremental prefetching: only fetches parts of a page not already in cache, reducing total transfer size.

Dataset: `dataset/perf/prefetch-navigation`

Reference:
- https://nextjs.org/docs/app/api-reference/components/link
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
