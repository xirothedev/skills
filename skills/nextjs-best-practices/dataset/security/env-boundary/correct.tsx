// Correct: Server-only env vars with validation
// env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Server-only secrets — NEVER exposed to client
    DATABASE_URL: z.string().url(),
    API_URL: z.string().url(),
    SECRET_API_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  },
  client: {
    // Client-safe public vars
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL,
    SECRET_API_KEY: process.env.SECRET_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
})

// Type-safe env access
export type Env = typeof env

// ---
// lib/db.ts (Server-only code)
import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

// Secret stays on server
export const db = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
})

// ---
// lib/api-client.ts (Server-only API client)
import { env } from '@/env'

export async function fetchInternalAPI(path: string, options?: RequestInit) {
  // Secret API key never leaves server
  const response = await fetch(`${env.API_URL}/api${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${env.SECRET_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// ---
// app/admin/page.tsx (Server Component)
import { db } from '@/lib/db'
import { AdminDashboard } from './admin-dashboard'

export default async function AdminPage() {
  // Server-side data fetching with secrets
  const stats = await db.stats.findMany()
  const sensitiveData = await fetchInternalAPI('/sensitive-data')

  // Pass only serializable data to Client Component
  return (
    <AdminDashboard
      stats={stats}
      publicData={sensitiveData.public}
    />
  )
}

// ---
// app/admin/admin-dashboard.tsx (Client Component)
'use client'

interface AdminDashboardProps {
  stats: Array<{ label: string; value: number }>
  publicData: { items: Array<{ id: string; name: string }> }
}

export function AdminDashboard({ stats, publicData }: AdminDashboardProps) {
  // No secrets here — only received serializable data
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <StatsGrid stats={stats} />
      <ItemsList items={publicData.items} />
    </div>
  )
}

// ---
// app/api/webhooks/stripe/route.ts (API Route)
import { env } from '@/env'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()

  // Server-side secret usage
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    env.STRIPE_WEBHOOK_SECRET
  )

  // Process webhook
  return NextResponse.json({ received: true })
}

// ---
// lib/server-only.ts (Explicit server-only boundary)
import 'server-only'

import { env } from '@/env'

// This file will throw error if imported in client code
export function getSecretKey() {
  return env.SECRET_API_KEY
}

export function getDatabaseUrl() {
  return env.DATABASE_URL
}