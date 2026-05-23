---
title: Replace getStaticProps/getStaticPaths with generateStaticParams
impact: CRITICAL
impactDescription: Migrates Pages Router data patterns to App Router equivalents
tags: server-components, static-generation, migration
versionScope: "14.x.x, 15.x.x, 16.x.x"
deprecatedFrom: "13.x.x"
dataset: server/no-sg-props
---

## Replace getStaticProps/getStaticPaths with generateStaticParams

The Pages Router data functions `getStaticProps` and `getStaticPaths` do not exist in the App Router. Use `generateStaticParams` for static route generation and direct `fetch()` in Server Components for data fetching.

**Incorrect (Pages Router pattern in App Router):**

```tsx
// This does NOT work in app/ directory
export async function getStaticProps() { ... }
export async function getStaticPaths() { ... }
```

**Correct (App Router static generation):**

```tsx
// app/posts/[slug]/page.tsx

// Replaces getStaticPaths
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((post: Post) => ({
    slug: post.slug,
  }))
}

// Replaces getStaticProps — data fetched directly in component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json())
  return <article><h1>{post.title}</h1><div>{post.content}</div></article>
}
```

For dynamic (non-static) routes, just omit `generateStaticParams` and fetch at request time:

```tsx
// app/posts/[slug]/page.tsx — dynamic, no generateStaticParams
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'no-store', // fresh on every request
  }).then(r => r.json())
  return <article>{post.title}</article>
}
```

Dataset: `dataset/server/no-sg-props`

Reference:
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://nextjs.org/docs/app/building-your-application/upgrading/codemods#static-generation
