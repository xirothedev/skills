---
title: Use proxy.ts Instead of middleware.ts (Next.js 16+)
impact: MEDIUM
impactDescription: Follows Next.js 16 naming convention for network boundary clarification
tags: proxy, middleware, naming, nextjs-16
versionScope: "16.x.x"
deprecatedFrom: "15.x.x"
dataset: api/proxy-rename
---

## Use proxy.ts Instead of middleware.ts (Next.js 16+)

Next.js 16 renames `middleware.ts` to `proxy.ts` to clarify its role as a network boundary for routing and request modification. The function export also changes from `middleware` to `proxy`.

**Incorrect (deprecated Next.js 15 and earlier naming):**

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.rewrite(new URL('/proxy/api', request.url))
  }
}

export const config = {
  matcher: ['/api/:path*', '/_next/:path*'],
}
```

**Correct (Next.js 16+ naming):**

```tsx
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.rewrite(new URL('/proxy/api', request.url))
  }
}

export const config = {
  matcher: ['/api/:path*', '/_next/:path*'],
}
```

Config property renames in `next.config.ts`:
- `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
- `middlewarePrefetch` → `proxyPrefetch`
- `middlewareClientMaxBodySize` → `proxyClientMaxBodySize`

Note: The `edge` runtime is NOT supported in `proxy.ts`. If you need edge runtime, keep using `middleware.ts`.

Dataset: `dataset/api/proxy-rename`

Reference:
- https://nextjs.org/docs/app/api-reference/config/next-config-js/skipProxyUrlNormalize
- https://nextjs.org/docs/app/building-your-application/upgrading/version-16
