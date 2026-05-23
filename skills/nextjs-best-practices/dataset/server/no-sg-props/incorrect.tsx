// INCORRECT: getStaticProps/getStaticPaths in App Router — doesn't work

// app/posts/[slug]/page.tsx — WRONG: Pages Router pattern in App Router
import { GetStaticPaths, GetStaticProps } from 'next'

interface Post {
  id: string
  slug: string
  title: string
}

// These exports are IGNORED in App Router
// They don't exist in the App Router API

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://api.example.com/posts')
  const posts: Post[] = await res.json()

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{ post: Post }> = async (context) => {
  const { slug } = context.params as { slug: string }
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  const post = await res.json()

  return {
    props: { post },
    revalidate: 60,
  }
}

// post prop is undefined — getStaticProps never runs
export default function PostPage({ post }: { post: Post }) {
  // TypeError: Cannot read properties of undefined (reading 'title')
  return <article><h1>{post.title}</h1></article>
}

// ---
// Another wrong pattern: using fallback export

// app/products/[id]/page.tsx — WRONG
export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',  // Ignored in App Router
})

export const getStaticProps = async () => ({
  props: { product: null },
})

export default function ProductPage({ product }: { product: unknown }) {
  // product is undefined
  return <div>{product}</div>
}

// ---
// WRONG: Trying to export revalidate alongside getStaticProps

// app/blog/page.tsx
export const revalidate = 60  // This works in App Router

// But this is ignored
export const getStaticProps = async () => {
  return {
    props: { posts: [] },
    revalidate: 60,  // This doesn't work
  }
}

// posts will be undefined
export default function BlogPage({ posts }: { posts: unknown[] }) {
  return <ul>{posts?.map((p: any) => <li key={p.id}>{p.title}</li>)}</ul>
}

// ---
// WRONG: Using getInitialProps pattern

// app/articles/[id]/page.tsx
ArticlePage.getInitialProps = async (ctx) => {
  // This is a Pages Router pattern, ignored in App Router
  const res = await fetch(`/api/articles/${ctx.query.id}`)
  return { article: await res.json() }
}

export default function ArticlePage({ article }: { article: unknown }) {
  return <div>{article}</div>  // article is undefined
}

// ---
// WRONG: Mixing generateStaticParams with getStaticProps

// app/docs/[slug]/page.tsx
export async function generateStaticParams() {
  return [{ slug: 'intro' }, { slug: 'guide' }]
}

// This is still ignored even with generateStaticParams
export const getStaticProps = async () => {
  return { props: { doc: {} } }
}

// doc is undefined, page params are correct but no data
export default function DocPage({ doc }: { doc: unknown }) {
  return <div>{doc}</div>
}

// ---
// Why these patterns fail in App Router:
// 1. getStaticProps/getStaticPaths are Pages Router exports
// 2. App Router uses Server Components, not data functions
// 3. These exports are silently ignored — no build error
// 4. Props are undefined at runtime
// 5. The fix: use generateStaticParams + async Server Component

// ---
// Correct migration:

// 1. Replace getStaticPaths with generateStaticParams
export async function generateStaticParams() {
  return [{ slug: 'hello' }, { slug: 'world' }]
}

// 2. Replace getStaticProps with async Server Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await fetch(`.../${slug}`, { next: { revalidate: 60 } })
  return <div>...</div>
}

// ---
// Runtime errors you'll see:
// TypeError: Cannot read properties of undefined (reading 'title')
//   at PostPage (app/posts/[slug]/page.tsx:42:18)
//
// Or silent undefined props causing:
// Error: Objects are not valid as a React child (found: undefined)