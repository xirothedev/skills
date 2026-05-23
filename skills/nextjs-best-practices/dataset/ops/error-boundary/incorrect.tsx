// Incorrect: No error handling, unhandled exceptions break the UI
// app/dashboard/page.tsx
import { db } from '@/lib/db'

export default async function DashboardPage() {
  // No try/catch, no error boundary
  // If this query fails, the entire app crashes with a cryptic error
  const users = await db.user.findMany()
  const stats = await db.stats.getCurrent()

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <p>Total: {stats.total}</p>
    </div>
  )
}

// No error.tsx file exists for this route
// No global-error.tsx file exists for the app

// ---
// Problems with this approach:
// 1. Database connection failure shows raw error stack to users
// 2. Network timeout displays cryptic "Failed to fetch" message
// 3. No way for users to retry the operation
// 4. No error logging or monitoring integration
// 5. Poor user experience — blank page or error stack

// Example of what users see:
// Error: connect ECONNREFUSED 127.0.0.1:5432
// at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
// ... 20 more lines of stack trace

// Or even worse, a blank white screen with:
// "Application error: a client-side exception has occurred (see browser console for details)"

// ---
// Another incorrect pattern: Silent failures
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    // Silent failure — no logging, no user feedback
    // User gets empty response or generic error
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Even worse: catching and ignoring
export async function POST(request: Request) {
  try {
    const body = await request.json()
    await db.user.create({ data: body })
    return NextResponse.json({ success: true })
  } catch {
    // Completely ignoring the error
    // User thinks operation succeeded but data wasn't saved
    return NextResponse.json({ success: true })
  }
}