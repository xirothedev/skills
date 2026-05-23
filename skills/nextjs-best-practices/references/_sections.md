# Section Definitions

Rules are grouped by filename prefix. Load a section only when it matches the task.

## 1. Architecture & Routing (arch)
**Impact:** CRITICAL
App Router structure, file conventions, routing patterns, layout composition, route handlers, and dynamic routing with `generateStaticParams`.

## 2. Server Components & Rendering (server)
**Impact:** CRITICAL
Server Component defaults, `'use client'` boundaries, async params handling, streaming with Suspense, and replacing deprecated `getServerSideProps`/`getStaticProps`.

## 3. API Routes & Server Actions (api)
**Impact:** CRITICAL
API route handler typing, Server Actions for mutations, `proxy.ts` (renamed from `middleware.ts` in Next.js 16), and request/response handling.

## 4. Data Fetching & Caching (data)
**Impact:** HIGH
`fetch()` cache options (`cache: 'no-store'`, `next: { revalidate }`), time-based vs on-demand revalidation, `unstable_cache` for cross-request deduplication, and `revalidatePath`/`revalidateTag`.

## 5. Client Components & Interactivity (client)
**Impact:** HIGH
Minimizing client surface area, prop serialization, React 19 patterns (no `forwardRef`), event handlers, and browser API usage.

## 6. Bundle Optimization (bundle)
**Impact:** MEDIUM-HIGH
Dynamic imports with `next/dynamic`, font optimization with `next/font`, barrel file avoidance, and third-party script deferral.

## 7. Performance & Optimization (perf)
**Impact:** MEDIUM-HIGH
Streaming UI with Suspense, prefetching, image optimization with `next/image`, and Core Web Vitals.

## 8. Security & Auth (security)
**Impact:** MEDIUM
Server Action validation, authentication in Server Actions and API routes, environment variable boundaries, and CSRF protection.

## 9. Testing Strategy (test)
**Impact:** MEDIUM
Testing Server vs Client components, Playwright e2e, and mocking patterns for Next.js-specific APIs.

## 10. Operations & Configuration (ops)
**Impact:** MEDIUM
`next.config.ts` validation, error boundaries (`error.tsx`, `global-error.tsx`), deployment defaults, and graceful operations.
