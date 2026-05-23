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
