// Correct: TypeScript config with env validation using @t3-oss/env-nextjs
// next.config.ts
import type { NextConfig } from 'next'
import { env } from './env'

const nextConfig: NextConfig = {
  // TypeScript catches typos and type errors at build time
  env: {
    API_URL: env.API_URL,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Production optimizations
  output: 'standalone',
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
}

export default nextConfig

// ---
// env.ts — Validated at application startup
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Server-only env vars — never exposed to client
    DATABASE_URL: z.string().url(),
    API_URL: z.string().url(),
    SECRET_API_KEY: z.string().min(1),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },
  client: {
    // Client-accessible env vars (must have NEXT_PUBLIC_ prefix)
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  },
  // Runtime env vars mapping
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL,
    SECRET_API_KEY: process.env.SECRET_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
  // Skip validation in CI if needed
  skipValidation: !!process.env.CI && !process.env.VALIDATE_ENV,
  // Show friendly error messages
  onValidationError: (issues) => {
    console.error('Environment validation failed:')
    issues.forEach((issue) => console.error(`  - ${issue.path.join('.')}: ${issue.message}`))
    process.exit(1)
  },
})

// ---
// Usage in server code
// lib/db.ts
import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
})

// ---
// Usage in API route
// app/api/users/route.ts
import { env } from '@/env'
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(`${env.API_URL}/users`)
  const users = await res.json()
  return NextResponse.json(users)
}

// ---
// package.json — Add validation to build
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}