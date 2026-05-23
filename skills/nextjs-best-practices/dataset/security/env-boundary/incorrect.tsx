// Incorrect: Server secrets leaked to client
// app/admin/client-dashboard.tsx
'use client'

// CRITICAL SECURITY ISSUE: This exposes the secret to the browser bundle
const API_KEY = process.env.SECRET_API_KEY
const DATABASE_URL = process.env.DATABASE_URL

export function Dashboard() {
  const handleClick = async () => {
    // SECRET_API_KEY is now visible in browser DevTools
    const response = await fetch(`/api/data?key=${API_KEY}`)
    const data = await response.json()
    console.log(data)
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* SECRET visible in rendered HTML */}
      <p>Connected to: {DATABASE_URL}</p>
      <button onClick={handleClick}>Load Data</button>
    </div>
  )
}

// Problems:
// 1. SECRET_API_KEY is bundled into client JavaScript
// 2. Anyone can view source and see the API key
// 3. DATABASE_URL exposes internal infrastructure
// 4. Secrets are now compromised and must be rotated

// ---
// Another incorrect pattern: Using NEXT_PUBLIC_ for secrets
// .env
NEXT_PUBLIC_STRIPE_SECRET=sk_live_xxx  // WRONG!
NEXT_PUBLIC_DATABASE_URL=postgres://... // WRONG!

// app/checkout/page.tsx
'use client'

// Even though it's "NEXT_PUBLIC", this is a SECRET key
const STRIPE_SECRET = process.env.NEXT_PUBLIC_STRIPE_SECRET

export function CheckoutPage() {
  // The secret is now in the browser bundle
  const handlePayment = async () => {
    const stripe = new Stripe(STRIPE_SECRET) // WRONG!
    // ...
  }
}

// ---
// Another incorrect pattern: Passing secrets as props
// app/admin/page.tsx (Server Component)
import { AdminClient } from './admin-client'

export default async function AdminPage() {
  // WRONG: Passing secret to Client Component
  return <AdminClient apiKey={process.env.SECRET_API_KEY!} />
}

// app/admin/admin-client.tsx (Client Component)
'use client'

export function AdminClient({ apiKey }: { apiKey: string }) {
  // apiKey is now in the client bundle
  const fetchData = async () => {
    await fetch('/api/data', {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
  }

  return <button onClick={fetchData}>Fetch</button>
}

// ---
// Another incorrect pattern: API key in client-side fetch
// app/public/widget.tsx
'use client'

export function PublicWidget() {
  const loadData = async () => {
    // API key embedded in client code
    const response = await fetch('https://api.example.com/data', {
      headers: {
        // CRITICAL: This key is visible in browser Network tab
        'X-API-Key': 'sk_live_abc123secretkey',
      },
    })
    return response.json()
  }

  return <button onClick={loadData}>Load Data</button>
}

// ---
// Another incorrect pattern: Conditional secret exposure
// app/feature/client.tsx
'use client'

export function FeatureComponent({ isAdmin }: { isAdmin: boolean }) {
  // WRONG: Conditional secret exposure doesn't prevent bundling
  const config = {
    apiKey: isAdmin ? process.env.SECRET_API_KEY : null,
  }

  // The secret is still in the bundle, just conditionally used
  // Bundle analyzers will show: process.env.SECRET_API_KEY

  return <div>{config.apiKey ? 'Admin Mode' : 'User Mode'}</div>
}

// ---
// Detection: What you'll see in production build
// .next/static/chunks/xxx.js
const e={SECRET_API_KEY:"sk_live_xxxxxxxxx",DATABASE_URL:"postgres://..."}

// Anyone viewing source can extract these secrets