// Incorrect: Heavy components in initial bundle — no dynamic import
// app/dashboard/page.tsx
import { Editor } from '@tinymce/tinymce-react'
import { Chart, registerables } from 'chart.js'
import { SettingsModal } from './settings-modal'

// All 3 libraries bundle into initial JS payload
// Chart.js (~200KB), TinyMCE (~500KB), modal dependencies
export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1>Dashboard</h1>

      {/* Editor always loaded even if user never clicks "Edit" */}
      <Editor
        apiKey="demo"
        init={{ plugins: 'lists link image' }}
      />

      {/* Chart always rendered — heavy canvas even when off-screen */}
      <AnalyticsChart />

      {/* Modal always imported — even when not shown */}
      <SettingsModal />
    </div>
  )
}

// ---
// app/dashboard/analytics-chart.tsx (heavy component in initial bundle)
'use client'

import { useRef, useEffect, useState } from 'react'
import { Chart, registerables } from 'chart.js' // Imported synchronously

// Problems:
// 1. Chart.js (~200KB gzipped) in initial bundle
// 2. Delays Time to Interactive for entire page
// 3. User may never scroll to see the chart
// 4. Editor (~500KB) also in bundle — even bigger delay
// 5. SSR error: Chart.js needs `window` — fails on server render

// ---
// Another incorrect pattern: dynamic import without loading state
import dynamic from 'next/dynamic'

const HeavyModal = dynamic(() => import('./heavy-modal'))

// Missing `loading` prop — user sees blank space while chunk loads
// No `ssr: false` for browser-only component
export function BadDynamicUsage() {
  const [show, setShow] = useState(false)
  return show ? <HeavyModal /> : <button onClick={() => setShow(true)}>Open</button>
}

// Problems:
// 1. No loading placeholder — CLS when chunk finally loads
// 2. Component may fail SSR if it uses window/document
// 3. No Suspense boundary for streaming fallback
