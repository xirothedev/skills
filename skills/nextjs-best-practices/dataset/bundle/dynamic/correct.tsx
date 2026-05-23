// Correct: Heavy components lazy-loaded with next/dynamic
// app/dashboard/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Rich text editor — large bundle, only needed when user clicks "Edit"
const RichEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  {
    loading: () => (
      <div className="animate-pulse h-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
    ),
    ssr: false, // Editor requires window/document APIs
  }
)

// Chart component — heavy math rendering, not above-fold
const AnalyticsChart = dynamic(
  () => import('./analytics-chart').then((mod) => mod.AnalyticsChart),
  {
    loading: () => (
      <div className="animate-pulse h-64 rounded-lg bg-gray-200 dark:bg-gray-800" />
    ),
  }
)

// Modal — only loaded on user interaction
const Spinner = () => <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full" />

const SettingsModal = dynamic(
  () => import('./settings-modal').then((mod) => mod.SettingsModal),
  {
    loading: () => <Spinner />,
  }
)

export default async function DashboardPage() {
  const data = await fetchDashboardData()

  return (
    <div className="p-6 space-y-6">
      <h1>Dashboard</h1>

      {/* Chart loads when visible */}
      <AnalyticsChart data={data.metrics} />

      {/* Editor loads only when user opens it — loading prop handles placeholder */}
      <RichEditor initialValue={data.content} />

      {/* Modal loads only when opened */}
      <SettingsModal />
    </div>
  )
}

async function fetchDashboardData() {
  const res = await fetch('https://api.example.com/dashboard', {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch dashboard')
  return res.json()
}

// ---
// app/dashboard/analytics-chart.tsx (heavy component, loaded dynamically)
'use client'

import { useRef, useEffect, useState } from 'react'

interface ChartData {
  labels: string[]
  values: number[]
}

export function AnalyticsChart({ data }: { data: ChartData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<import('chart.js').Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let instance: import('chart.js').Chart | null = null

    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      instance = new Chart(canvasRef.current!, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{ data: data.values }],
        },
      })
      chartRef.current = instance
    })

    return () => {
      instance?.destroy()
    }
  }, [data])

  return <canvas ref={canvasRef} />
}
