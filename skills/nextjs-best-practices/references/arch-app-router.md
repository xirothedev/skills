---
title: Use App Router as Default Architecture
impact: CRITICAL
impactDescription: Prevents Pages Router tech debt, enables Server Components and modern data fetching
tags: app-router, file-conventions, architecture
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: arch/app-router
---

## Use App Router as Default Architecture

Next.js applications should use the `app/` directory (App Router) as the default architecture. The `pages/` directory (Pages Router) is legacy and lacks Server Components, Suspense streaming, React Server Components, and the modern data fetching API.

**Incorrect (Pages Router):**

```tsx
// pages/index.tsx
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return { props: { data } }
}

export default function Home({ data }: { data: any }) {
  return <pre>{JSON.stringify(data)}</pre>
}
```

**Correct (App Router):**

```tsx
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export default async function Home() {
  const data = await getData()
  return <pre>{JSON.stringify(data)}</pre>
}
```

For existing Pages Router projects, migrate incrementally: both routers can coexist during migration, but new routes should always go in `app/`.

Dataset: `dataset/arch/app-router`

Reference:
- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/building-your-application/routing
