---
title: Minimize Client Component Surface Area
impact: HIGH
impactDescription: Reduces JavaScript bundle shipped to the browser, improves initial page load
tags: client-components, boundaries, performance
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: client/boundary
---

## Minimize Client Component Surface Area

Every `'use client'` component and its dependencies are included in the client bundle. Push interactivity to the leaves of your component tree. Pass Server Components as children or props to Client Components to avoid bundling server-side logic.

**Incorrect (Server Component bundled in client):**

```tsx
// app/dashboard/page.tsx
'use client'

import { getDashboardData } from '@/lib/data'
import { Chart } from '@/components/chart'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboardData().then(setData)
  }, [])

  return <Chart data={data} />
}
```

**Correct (Server Component fetches, passes data to small Client Component):**

```tsx
// app/dashboard/page.tsx (Server Component — zero client JS)
import { getDashboardData } from '@/lib/data'
import { Chart } from './chart'

export default async function Dashboard() {
  const data = await getDashboardData()
  return <Chart data={data} />
}
```

```tsx
// app/dashboard/chart.tsx (Client Component — only interactivity)
'use client'

import { useState } from 'react'

export function Chart({ data }: { data: DashboardData }) {
  const [view, setView] = useState<'bar' | 'line'>('bar')
  return (
    <>
      <button onClick={() => setView('bar')}>Bar</button>
      <button onClick={() => setView('line')}>Line</button>
      {/* render chart based on view and data */}
    </>
  )
}
```

**Correct (Server Component as child of Client Component):**

```tsx
// components/modal.tsx (Client Component)
'use client'

import { useState, type ReactNode } from 'react'

export function Modal({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      {open && <div role="dialog">{children}</div>}
    </>
  )
}
```

```tsx
// app/page.tsx (Server Component)
import { Modal } from '@/components/modal'
import { ServerOnlyExpensiveComponent } from './server-only'

export default function Page() {
  return (
    <Modal trigger="Open">
      {/* This runs on the server — NOT bundled in client */}
      <ServerOnlyExpensiveComponent />
    </Modal>
  )
}
```

Dataset: `dataset/client/boundary`

Reference:
- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
- https://nextjs.org/docs/app/building-your-application/rendering/client-components
