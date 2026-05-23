---
title: Lazy-Load Heavy Components with next/dynamic
impact: HIGH
impactDescription: Reduces initial bundle size, defers loading of non-critical components
tags: bundle-optimization, dynamic-imports, performance
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: bundle/dynamic
---

## Lazy-Load Heavy Components with next/dynamic

Use `next/dynamic` to defer loading of components not needed on initial render. This reduces the initial JavaScript bundle and improves Time to Interactive.

**Incorrect (heavy component in initial bundle):**

```tsx
import { Editor } from '@tinymce/tinymce-react'
import { Chart } from 'chart.js'

export default function Dashboard() {
  return (
    <div>
      <Editor apiKey="xxx" />
      <Chart type="bar" data={data} />
    </div>
  )
}
```

**Correct (dynamic imports with loading states):**

```tsx
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200" />,
  ssr: false, // editor needs browser APIs
})

const Chart = dynamic(() => import('chart.js').then(mod => mod.Chart), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200" />,
})

export default function Dashboard() {
  return (
    <div>
      <Editor apiKey="xxx" />
      <Chart type="bar" data={data} />
    </div>
  )
}
```

Use `ssr: false` for components that depend on browser APIs (window, document, navigator). Use `loading` to show a placeholder while the component loads.

For components that should only load on user interaction (modals, dropdowns), combine with Suspense:

```tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const HeavyModal = dynamic(() => import('./heavy-modal'), {
  loading: () => <Spinner />,
})

export function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      {showModal && <HeavyModal />}
    </Suspense>
  )
}
```

Dataset: `dataset/bundle/dynamic`

Reference:
- https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- https://nextjs.org/docs/app/api-reference/functions/dynamic
