---
title: Pass Serializable Props to Client Components
impact: MEDIUM
impactDescription: Prevents serialization errors and performance issues when passing non-serializable data
tags: client-components, props, serialization
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: client/props-serialization
---

## Pass Serializable Props to Client Components

Props passed from Server Components to Client Components must be serializable (JSON-like). Passing functions, class instances, or Promises causes runtime errors.

**Incorrect (non-serializable props):**

```tsx
// app/dashboard/page.tsx (Server Component)
import { getUser } from '@/lib/auth'

export default async function Dashboard() {
  const user = await getUser()
  // ❌ Passing a function (not serializable)
  return <ClientDashboard logAction={() => console.log(user.id)} />
}
```

**Correct (serializable props only):**

```tsx
// app/dashboard/page.tsx (Server Component)
import { getUser } from '@/lib/auth'

export default async function Dashboard() {
  const user = await getUser()
  // ✅ Pass plain objects, strings, numbers, arrays
  return <ClientDashboard userId={user.id} name={user.name} />
}
```

```tsx
// app/dashboard/client-dashboard.tsx (Client Component)
'use client'

export function ClientDashboard({ userId, name }: { userId: string; name: string }) {
  const logAction = () => console.log(userId)
  return <div>Welcome, {name}</div>
}
```

Rules for serializable props:
- ✅ Primitives: string, number, boolean, null, undefined
- ✅ Arrays and plain objects of serializable values
- ✅ Dates (serialized as ISO strings)
- ✅ BigInt (serialized as string)
- ❌ Functions, Promises, class instances, Symbols, RegExp, Map, Set

Dataset: `dataset/client/props-serialization`

Reference:
- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-serializable-props-and-serializing-state
