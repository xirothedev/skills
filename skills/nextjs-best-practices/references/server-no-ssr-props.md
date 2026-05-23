---
title: Replace getServerSideProps with Server Components
impact: CRITICAL
impactDescription: Migrates Pages Router SSR pattern to App Router equivalent
tags: server-components, ssr, migration
versionScope: "14.x.x, 15.x.x, 16.x.x"
deprecatedFrom: "13.x.x"
dataset: server/no-ssr-props
---

## Replace getServerSideProps with Server Components

`getServerSideProps` does not exist in the App Router. Fetch data directly in Server Components with `cache: 'no-store'` for per-request freshness.

**Incorrect (Pages Router SSR in App Router context):**

```tsx
// This does NOT work in app/
export async function getServerSideProps() {
  const data = await fetchData()
  return { props: { data } }
}
```

**Correct (App Router Server Component):**

```tsx
// app/dashboard/page.tsx
export default async function Dashboard() {
  // fetch with no-store = per-request, same as getServerSideProps
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  }).then(r => r.json())
  return <pre>{JSON.stringify(data)}</pre>
}
```

The `cache: 'no-store'` option tells Next.js to fetch fresh data on every request, matching `getServerSideProps` behavior.

Dataset: `dataset/server/no-ssr-props`

Reference:
- https://nextjs.org/docs/app/building-your-application/upgrading/codemods#data-fetching
- https://nextjs.org/docs/app/building-your-application/data-fetching/fetching
