---
title: Never Leak Server Environment Variables to Client
impact: HIGH
impactDescription: Prevents exposure of API keys, database credentials, and secrets to the browser
tags: security, environment-variables, boundaries
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: security/env-boundary
---

## Never Leak Server Environment Variables to Client

Environment variables without the `NEXT_PUBLIC_` prefix are only available in Server Components and API routes. Never reference server-only env vars in Client Components or in any code that could be bundled for the browser.

**Incorrect (server secret in Client Component):**

```tsx
// app/admin/client-dashboard.tsx
'use client'

// This exposes the secret key to the browser bundle
const API_KEY = process.env.SECRET_API_KEY

export function Dashboard() {
  return <button onClick={() => fetch(`/api/data?key=${API_KEY}`)}>Load</button>
}
```

**Correct (server-side proxy for secrets):**

```tsx
// app/admin/server-dashboard.tsx (Server Component)
export default async function Dashboard() {
  // Secret stays on the server
  const apiKey = process.env.SECRET_API_KEY
  const data = await fetchInternalData(apiKey)
  return <ClientDashboard data={data} />
}
```

```tsx
// app/admin/client-dashboard.tsx
'use client'

export function ClientDashboard({ data }: { data: DashboardData }) {
  return <div>{/* render data — no secret needed client-side */}</div>
}
```

For env validation, use `@t3-oss/env-nextjs` to catch missing vars at startup:

```tsx
// env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SECRET_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET_API_KEY: process.env.SECRET_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

Dataset: `dataset/security/env-boundary`

Reference:
- https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- https://nextjs.org/docs/app/api-reference/config/next-config-js/env
