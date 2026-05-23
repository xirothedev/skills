// Correct: Next.js 16+ proxy.ts naming and export
// proxy.ts (NOT middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Auth check — redirect unauthenticated users
  const hasSession = request.cookies.has('session')

  if (!hasSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // API rewriting — internal service routing
  if (request.nextUrl.pathname.startsWith('/api/internal')) {
    const newPath = request.nextUrl.pathname.replace('/api/internal', '/api/v2')
    return NextResponse.rewrite(new URL(newPath, request.url))
  }
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/_next/:path*'],
}

// ---
// app/api/internal/health/route.ts (rewritten to /api/v2/health)
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', version: 2 })
}

// ---
// next.config.ts (updated config property names)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 renamed config options
  skipProxyUrlNormalize: true,
  proxyPrefetch: true,
  proxyClientMaxBodySize: '10mb',
}

export default nextConfig

// Key points:
// 1. File named proxy.ts (not middleware.ts)
// 2. Export named `proxy` (not `middleware`)
// 3. Same NextRequest/NextResponse API
// 4. Matcher config unchanged
// 5. Edge runtime NOT supported — use middleware.ts if needed
