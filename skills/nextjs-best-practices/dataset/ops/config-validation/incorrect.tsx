// Incorrect: No config validation, undefined at runtime
// next.config.js (JavaScript, not TypeScript)
module.exports = {
  env: {
    // No validation — undefined at runtime if env var is missing
    API_URL: process.env.API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET_KEY: process.env.SECRET_KEY,
  },
  // Typos not caught by TypeScript
  expiramental: {
    // Typo: "expiramental" instead of "experimental"
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // No type checking for config options
  otput: 'standalone', // Typo: "otput" instead of "output"
}

// ---
// lib/api.ts — Using process.env directly without validation
export async function fetchUsers() {
  // If API_URL is undefined, this will fail silently or with cryptic error
  const res = await fetch(`${process.env.API_URL}/users`)
  // process.env.API_URL might be undefined, resulting in "/users" URL
  return res.json()
}

// ---
// app/api/data/route.ts — No validation, fails at runtime
import { NextResponse } from 'next/server'

export async function GET() {
  // Error: DATABASE_URL is undefined
  // This only fails when the route is called, not at startup
  const db = await connectToDatabase(process.env.DATABASE_URL)
  const data = await db.query('SELECT * FROM users')
  return NextResponse.json(data)
}

// ---
// Problems with this approach:
// 1. Typos in config options not caught until runtime
// 2. Missing env vars cause undefined behavior
// 3. Invalid URL formats not validated
// 4. No IDE autocomplete for config options
// 5. Errors occur in production, not during build
// 6. No separation between server-only and client env vars

// Example runtime error:
// TypeError: Cannot read properties of undefined (reading 'users')
// at fetchUsers (lib/api.ts:3:24)

// Or worse: API calls go to wrong URL
// fetch("undefined/users") → NetworkError

// Or database connection with undefined URL
// connectToDatabase(undefined) → throws cryptic error