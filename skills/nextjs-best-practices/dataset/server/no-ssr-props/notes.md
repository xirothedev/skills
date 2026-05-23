# No SSR Props Dataset

Use this case when migrating from `getServerSideProps` to App Router Server Components.

## Pages Router (Deprecated in App Router)

In Pages Router, `getServerSideProps` fetched data on every request:

```tsx
// pages/products/[id].tsx — Pages Router pattern
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return { props: { product } }
}

export default function ProductPage({ product }: { product: Product }) {
  return <div>{product.name}</div>
}
```

This pattern does NOT work in App Router (`app/` directory).

## App Router Replacement

Use Server Components with `fetch(cache: 'no-store')`:

```tsx
// app/products/[id]/page.tsx — App Router pattern
interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    cache: 'no-store',  // Fetch on every request (SSR behavior)
  })
  return res.json()
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

## Key Differences

| Feature | Pages Router | App Router |
|---------|--------------|------------|
| Data fetch | `getServerSideProps` | Server Component async |
| Request freshness | Automatic | `cache: 'no-store'` |
| Props drilling | Required | Direct access |
| Streaming | No | Yes (with Suspense) |
| Partial rendering | No | Yes |

## Incorrect (Using getServerSideProps in app/)

```tsx
// app/products/page.tsx — WRONG: getServerSideProps doesn't work in app/
export const getServerSideProps = async () => {
  return { props: { products: [] } }
}

export default function ProductsPage({ products }) {
  return <div>{products.length}</div>
}
```

This is silently ignored — `products` will be undefined.

## Correct Patterns for SSR-like Behavior

### Per-request freshness (SSR equivalent)
```tsx
const data = await fetch(url, { cache: 'no-store' })
```

### With request headers
```tsx
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const auth = headersList.get('authorization')
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: auth! }
  })
  return <div>...</div>
}
```

### With cookies
```tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: `session=${session?.value}` }
  })
  return <div>...</div>
}
```