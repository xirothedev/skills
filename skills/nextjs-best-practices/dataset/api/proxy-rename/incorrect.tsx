// Incorrect: Deprecated middleware.ts naming (Next.js 15 and earlier)
// middleware.ts (WRONG in Next.js 16+ — should be proxy.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// WRONG export name — Next.js 16 expects `proxy` not `middleware`
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.rewrite(new URL('/proxy/api', request.url))
  }
}

export const config = {
  matcher: ['/api/:path*', '/_next/:path*'],
}

// Problems in Next.js 16+:
// 1. File should be proxy.ts — middleware.ts is legacy naming
// 2. Export should be `proxy` — `middleware` is deprecated
// 3. Config options renamed (skipMiddlewareUrlNormalize → skipProxyUrlNormalize)
// 4. May cause confusion — proxy clarifies network boundary role

// ---
// next.config.js (WRONG — deprecated config property names)
module.exports = {
  // These config options were renamed in Next.js 16
  skipMiddlewareUrlNormalize: true, // Should be skipProxyUrlNormalize
  middlewarePrefetch: 'all',         // Should be proxyPrefetch
}

// Problems:
// 1. Old config property names — may be ignored in Next.js 16+
// 2. No TypeScript — config typos caught at runtime, not build time
// 3. Missing proxy.ts — request routing uses deprecated middleware
