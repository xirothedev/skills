# No Static Props Dataset

Use this case when migrating from `getStaticProps`/`getStaticPaths` to App Router.

## Pages Router (Deprecated in App Router)

In Pages Router, static generation used:

```tsx
// pages/posts/[slug].tsx — Pages Router pattern
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))
  
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string }
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  const post = await res.json()
  
  return {
    props: { post },
    revalidate: 60, // ISR
  }
}

export default function PostPage({ post }: { post: Post }) {
  return <article>{post.title}</article>
}
```

This pattern does NOT work in App Router.

## App Router Replacement

Use `generateStaticParams` + Server Component with fetch:

```tsx
// app/posts/[slug]/page.tsx — App Router pattern
interface PageProps {
  params: Promise<{ slug: string }>
}

// generateStaticParams replaces getStaticPaths
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/posts')
  const posts: Post[] = await res.json()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Server Component fetches data
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  return <article>{post.title}</article>
}

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    // Static generation with revalidation (ISR equivalent)
    next: { revalidate: 60 },
  })
  return res.json()
}
```

## Key Differences

| Feature | Pages Router | App Router |
|---------|--------------|------------|
| Paths function | `getStaticPaths` | `generateStaticParams` |
| Data function | `getStaticProps` | Server Component |
| Fallback | `fallback: true/'blocking'` | `dynamicParams = true/false` |
| Revalidation | `revalidate: 60` in props | `next: { revalidate: 60 }` in fetch |
| Dynamic segments | `{ params: { slug } }` | `{ slug }` (flat object) |

## Incorrect (Using getStaticProps in app/)

```tsx
// app/posts/[slug]/page.tsx — WRONG
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = async (context) => {
  return { props: { post: {} } }
}

export default function PostPage({ post }) {
  return <div>{post.title}</div>  // post is undefined
}
```

These exports are ignored — the component receives undefined props.

## Correct Patterns

### Static generation (build time)
```tsx
export async function generateStaticParams() {
  return [{ slug: 'hello-world' }, { slug: 'first-post' }]
}

async function getPost(slug: string) {
  const res = await fetch(`.../${slug}`, {
    cache: 'force-cache',  // Default, fetch at build time
  })
  return res.json()
}
```

### ISR (Incremental Static Regeneration)
```tsx
async function getPost(slug: string) {
  const res = await fetch(`.../${slug}`, {
    next: { revalidate: 60 },  // Revalidate every 60 seconds
  })
  return res.json()
}
```

### Dynamic params control
```tsx
export const dynamicParams = true  // Allow on-demand generation (default)
// or
export const dynamicParams = false // 404 for paths not in generateStaticParams
```