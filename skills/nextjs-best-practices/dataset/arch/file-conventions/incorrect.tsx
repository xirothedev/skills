// INCORRECT: Wrong file names — these break Next.js conventions

// app/index.tsx — WRONG: should be page.tsx
// Next.js will NOT recognize this as a route
export default function HomePage() {
  return <main>Home</main>
}

// app/main-layout.tsx — WRONG: should be layout.tsx
// Next.js will NOT use this as a layout
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/products/Index.tsx — WRONG: should be page.tsx (case matters)
// This file will be ignored by Next.js routing
export default function ProductsPage() {
  return <div>Products</div>
}

// app/products/product-layout.tsx — WRONG: should be layout.tsx
// This will not wrap child routes
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <div className="product-wrapper">{children}</div>
}

// app/api/users.ts — WRONG: should be route.ts
// This will NOT create an API endpoint
export async function GET() {
  return Response.json({ users: [] })
}

// app/pages.tsx — WRONG: confusing with Pages Router
// File name suggests Pages Router pattern but in app/ directory
export default function PagesRoute() {
  return <div>Confusing naming</div>
}

// ---
// Why this fails:
// 1. Next.js App Router uses exact file names as conventions
// 2. 'index.tsx' is a Pages Router convention, not App Router
// 3. 'layout.tsx' must be exactly that name — no variations
// 4. API routes MUST be 'route.ts' — not '.ts' or 'index.ts'
// 5. Case sensitivity: 'Page.tsx' != 'page.tsx' on Linux/Mac