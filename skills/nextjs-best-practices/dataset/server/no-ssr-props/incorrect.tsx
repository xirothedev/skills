// INCORRECT: getServerSideProps in App Router — doesn't work

// app/products/page.tsx — WRONG: Pages Router pattern in App Router
import { GetServerSideProps } from 'next'

interface Product {
  id: string
  name: string
  price: number
}

// This export is IGNORED in App Router
// The function is never called, props never passed
export const getServerSideProps: GetServerSideProps<{ products: Product[] }> = async () => {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()

  return {
    props: {
      products,
    },
  }
}

// products prop will be undefined at runtime
export default function ProductsPage({ products }: { products: Product[] }) {
  // TypeError: Cannot read properties of undefined (reading 'map')
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}

// ---
// Another wrong pattern: mixing conventions

// app/dashboard/page.tsx — WRONG: getInitialProps doesn't exist in App Router
ProductPage.getInitialProps = async () => {
  return { data: [] }
}

export default function ProductPage({ data }: { data: unknown[] }) {
  return <div>{data.length} items</div>  // data is undefined
}

// ---
// WRONG: Trying to use getServerSideProps with generateMetadata

// app/blog/[slug]/page.tsx
import { Metadata, GetServerSideProps } from 'next'

// This won't work — getServerSideProps ignored
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }
  const post = await fetch(`/api/posts/${slug}`).then(r => r.json())
  return { props: { post } }
}

// This metadata function won't have access to fetched data
export async function generateMetadata(): Promise<Metadata> {
  // No way to get data from getServerSideProps here
  return { title: 'Unknown' }
}

export default function BlogPost({ post }: { post: { title: string } }) {
  // post is undefined because getServerSideProps is ignored
  return <h1>{post?.title ?? 'Not Found'}</h1>
}

// ---
// WRONG: Exporting data fetch as separate function in Server Component

// app/users/page.tsx
// This looks correct but is a common mistake
export async function getServerSideData() {  // Not a real Next.js export
  const res = await fetch('https://api.example.com/users')
  return res.json()
}

// The function above is never called by Next.js
export default async function UsersPage() {
  // This fetch happens, but without cache: 'no-store' it may be cached
  const users = await getServerSideData()
  return <div>{users.length}</div>
}

// ---
// Why getServerSideProps fails in App Router:
// 1. App Router uses Server Components, not getServerSideProps
// 2. The export is silently ignored — no error at build time
// 3. Props are undefined at runtime, causing TypeErrors
// 4. No hydration mismatch warning because SSR never provided data
// 5. The fix: use async Server Component with fetch(cache: 'no-store')

// ---
// Runtime errors you'll see:
// TypeError: Cannot read properties of undefined (reading 'map')
//   at ProductsPage (app/products/page.tsx:25:15)