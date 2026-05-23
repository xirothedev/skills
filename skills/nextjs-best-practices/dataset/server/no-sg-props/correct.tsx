// app/posts/[slug]/page.tsx — Static generation with generateStaticParams
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  publishedAt: string
  author: {
    name: string
    avatar: string
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// generateStaticParams replaces getStaticPaths
// Called at build time to generate static pages
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/posts', {
    // Fetch list at build time with caching
    cache: 'force-cache',
  })

  if (!res.ok) {
    return [] // Handle gracefully, generate on-demand later
  }

  const posts: Post[] = await res.json()

  // Return array of params objects (flat, no nested params key)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Fetch individual post with ISR
async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    // ISR: revalidate every 5 minutes
    next: {
      revalidate: 300,
      tags: ['posts'],  // Can use revalidateTag('posts') elsewhere
    },
  })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch post: ${slug}`)
  }

  return res.json()
}

// Generate metadata for each post
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  }
}

// Allow dynamic generation for posts not in generateStaticParams
export const dynamicParams = true // Default is true

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="meta">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="avatar"
          />
          <span>{post.author.name}</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </header>

      <div className="post-content">
        {post.content}
      </div>
    </article>
  )
}

// --- Separate file: app/products/[category]/[id]/page.tsx ---

// Multiple dynamic segments

interface Product {
  id: string
  name: string
  category: string
  price: number
}

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>
}

// Generate all category/id combinations
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products: Product[] = await res.json()

  // For multiple segments, return objects with all params
  return products.map((product) => ({
    category: product.category,
    id: product.id,
  }))
}

async function getProduct(category: string, id: string): Promise<Product | null> {
  const res = await fetch(`https://api.example.com/products/${category}/${id}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })

  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, id } = await params
  const product = await getProduct(category, id)

  if (!product) {
    notFound()
  }

  return (
    <div className="product">
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
    </div>
  )
}

// --- Separate file: app/docs/[...slug]/page.tsx (catch-all) ---

// Catch-all routes with generateStaticParams

interface Doc {
  slug: string[]
  title: string
  content: string
}

interface DocPageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/docs')
  const docs: Doc[] = await res.json()

  // For catch-all routes, slug is an array
  return docs.map((doc) => ({
    slug: doc.slug, // ['guide', 'getting-started']
  }))
}

async function getDoc(slug: string[]): Promise<Doc | null> {
  const res = await fetch(`https://api.example.com/docs/${slug.join('/')}`, {
    cache: 'force-cache', // Static, no revalidation
  })

  if (!res.ok) return null
  return res.json()
}

// Disable on-demand generation for docs
export const dynamicParams = false

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params
  const doc = await getDoc(slug)

  if (!doc) {
    notFound()
  }

  return (
    <article className="docs">
      <h1>{doc.title}</h1>
      <div className="content">{doc.content}</div>
      <nav className="breadcrumbs">
        {slug.map((segment, i) => (
          <span key={i}>{segment}</span>
        ))}
      </nav>
    </article>
  )
}