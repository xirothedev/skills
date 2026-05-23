// Incorrect: Entire page is a Client Component with useEffect data fetching
// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'

interface DashboardData {
  metrics: { label: string; value: number }[]
  recentActivity: { id: string; action: string; timestamp: string }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Metrics</h2>
        {data.metrics.map((m) => (
          <div key={m.label}>
            {m.label}: {m.value}
          </div>
        ))}
      </section>
      <section>
        <h2>Recent Activity</h2>
        <ul>
          {data.recentActivity.map((a) => (
            <li key={a.id}>
              {a.action} at {a.timestamp}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// Problems:
// 1. Entire page ships to client — React + fetch logic + state management
// 2. No SSR of data — users see "Loading..." flash before content appears
// 3. Extra round-trip: HTML render → JS load → useEffect → fetch → render
// 4. SEO suffers — search engines see loading state, not content
// 5. Cumulative Layout Shift (CLS) as content loads after initial paint