---
title: Wrap Runtime Data Access in Suspense
impact: CRITICAL
impactDescription: Keeps the static shell valid while streaming request-time data
tags: suspense, cookies, headers, runtime-data, streaming
dataset: cache/runtime-suspense
---

## Wrap Runtime Data Access in Suspense

Runtime APIs such as `cookies()`, `headers()`, request `params`, and `searchParams` need request context. With Cache Components, components that access runtime data should render under a Suspense boundary.

**Incorrect (runtime access blocks prerendering):**

```typescript
export default async function Page() {
  const theme = (await cookies()).get("theme")?.value;
  return <ThemePanel theme={theme} />;
}
```

**Correct (request-time island):**

```typescript
export default function Page() {
  return (
    <Suspense fallback={<ThemeSkeleton />}>
      <ThemePanel />
    </Suspense>
  );
}
```

## Source References

- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/getting-started/fetching-data
