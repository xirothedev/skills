// app/products/[id]/page.tsx — Next.js 15+ async params pattern
import { getProduct, getRelatedProducts } from '@/lib/products'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductGallery } from './product-gallery'
import { RelatedProducts } from './related-products'

// Proper TypeScript interface for Next.js 15+ page props
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    variant?: string
    color?: string
  }>
}

// generateMetadata also receives async params
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl }],
    },
  }
}

export default async function ProductPage({
  params,
  searchParams
}: PageProps) {
  // Await both params and searchParams
  const { id } = await params
  const { variant, color } = await searchParams

  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Selected variant based on searchParams
  const selectedVariant = variant
    ? product.variants.find(v => v.id === variant)
    : product.variants[0]

  return (
    <main className="product-page">
      <article className="product-detail">
        <h1>{product.name}</h1>
        <p className="price">${selectedVariant.price}</p>

        {color && (
          <p className="selected-color">Selected color: {color}</p>
        )}

        <ProductGallery
          images={product.images}
          variantId={selectedVariant.id}
        />
      </article>

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsPromise productId={id} />
      </Suspense>
    </main>
  )
}

// Helper component that receives resolved params
async function RelatedProductsPromise({ productId }: { productId: string }) {
  const related = await getRelatedProducts(productId)
  return <RelatedProducts products={related} />
}

function RelatedProductsSkeleton() {
  return (
    <aside className="skeleton">
      <div className="skeleton-item" />
      <div className="skeleton-item" />
      <div className="skeleton-item" />
    </aside>
  )
}

// --- Separate file: app/api/products/[id]/route.ts ---

import { NextRequest } from 'next/server'
import { getProduct, updateProduct, deleteProduct } from '@/lib/products'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/products/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params

  const product = await getProduct(id)

  if (!product) {
    return Response.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  return Response.json(product)
}

// PATCH /api/products/:id
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params
  const body = await request.json()

  const updated = await updateProduct(id, body)

  return Response.json(updated)
}

// DELETE /api/products/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params

  await deleteProduct(id)

  return new Response(null, { status: 204 })
}

// --- Separate file: app/shop/[...slug]/page.tsx (catch-all) ---

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params

  // slug is an array: /shop/a/b/c -> ['a', 'b', 'c']
  const [category, subcategory, productId] = slug

  return (
    <div>
      <p>Category: {category}</p>
      {subcategory && <p>Subcategory: {subcategory}</p>}
      {productId && <p>Product ID: {productId}</p>}
    </div>
  )
}