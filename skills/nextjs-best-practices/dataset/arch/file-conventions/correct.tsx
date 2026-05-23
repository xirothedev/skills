// app/layout.tsx — Root layout (required, must have html and body tags)
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'A Next.js application with proper file conventions',
  openGraph: {
    title: 'My App',
    description: 'A Next.js application',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// --- Separate file: app/page.tsx ---

import type { Metadata } from 'next'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our store',
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <nav className="flex gap-4 mb-8">
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
      </nav>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        <ul className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

// --- Separate file: app/products/layout.tsx ---

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="products-section">
      <aside className="filters">
        {/* Product filters sidebar */}
      </aside>
      <div className="products-content">{children}</div>
    </section>
  )
}

// --- Separate file: app/products/[id]/page.tsx ---

import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/products'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Product Not Found' }
  return { title: product.name }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price}</span>
    </article>
  )
}