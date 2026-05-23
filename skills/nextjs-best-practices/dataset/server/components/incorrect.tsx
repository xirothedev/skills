'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>
  return <div>{JSON.stringify(data)}</div>
}
