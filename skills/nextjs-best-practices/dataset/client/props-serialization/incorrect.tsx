// Incorrect: Passing non-serializable props (functions) to Client Component
// app/dashboard/page.tsx (Server Component)
import { getUser } from '@/lib/auth'
import { ClientDashboard } from './client-dashboard'

export default async function DashboardPage() {
  const user = await getUser()

  // ERROR: Functions cannot be passed from Server to Client Components
  // This will fail at runtime with: "Functions cannot be passed as props"
  return (
    <ClientDashboard
      userId={user.id}
      name={user.name}
      // These are all non-serializable and will cause runtime errors:
      onLogAction={(action: string) => console.log(user.id, action)}
      onThemeChange={(theme: string) => updateTheme(theme)}
      formatDate={(date: Date) => date.toLocaleDateString()}
      validateInput={(value: string) => value.length > 0}
    />
  )
}

// ---
// Other incorrect patterns:

// Passing a Promise directly (should await first)
export default async function Page() {
  const dataPromise = fetch('/api/data').then(r => r.json())

  // ERROR: Promises cannot be passed as props
  return <ClientComponent data={dataPromise} />
}

// Correct: await the promise first
export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json())
  return <ClientComponent data={data} />
}

// ---
// Passing class instances
class UserValidator {
  validate(email: string) { return email.includes('@') }
}

export default async function Page() {
  const validator = new UserValidator()

  // ERROR: Class instances cannot be passed as props
  return <ClientComponent validator={validator} />
}

// ---
// Passing Map or Set
export default async function Page() {
  const userMap = new Map([['a', { name: 'Alice' }], ['b', { name: 'Bob' }]])
  const tagSet = new Set(['typescript', 'react'])

  // ERROR: Map and Set cannot be passed as props
  return <ClientComponent users={userMap} tags={tagSet} />
}

// Correct: Convert to plain objects/arrays
export default async function Page() {
  const userMap = new Map([['a', { name: 'Alice' }], ['b', { name: 'Bob' }]])
  const tagSet = new Set(['typescript', 'react'])

  return (
    <ClientComponent
      users={Object.fromEntries(userMap)}
      tags={Array.from(tagSet)}
    />
  )
}

// ---
// Runtime error message you'll see:
// Error: Functions cannot be passed as a Client Component prop.
// Error: Only plain objects can be passed as props.
// During prerendering, props must be JSON-serializable.