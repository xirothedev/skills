# Server Components Dataset

Use this case when deciding between Server Components and Client Components.

## Incorrect (entire page is Client Component)

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
  return <div>{JSON.stringify(data)}</div>
}
```

Problems:
- Ships React + fetch logic to client
- No SSR of data — flash of empty state
- Extra round-trip: render → mount → fetch → update

## Correct (Server Component fetches, Client Component handles interactivity)

```tsx
// page.tsx — Server Component
import { DataDisplay } from './data-display'

async function getData() {
  return fetch('https://api.example.com/data').then(r => r.json())
}

export default async function Page() {
  const data = await getData()
  return <DataDisplay initialData={data} />
}
```

```tsx
// data-display.tsx — Client Component
'use client'

import { useState } from 'react'

export function DataDisplay({ initialData }: { initialData: DataItem[] }) {
  const [filter, setFilter] = useState('')
  const filtered = initialData.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filtered.map(d => <div key={d.id}>{d.name}</div>)}
    </>
  )
}
```

Benefits:
- Data fetched on server — zero client JS for fetching
- SSR with data already populated
- Client Component only handles the interactive filter input
