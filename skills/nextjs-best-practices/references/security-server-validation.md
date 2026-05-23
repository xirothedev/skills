---
title: Validate Inputs in Server Actions and API Routes
impact: CRITICAL
impactDescription: Prevents injection attacks, type errors, and invalid data reaching the database
tags: security, validation, server-actions, zod
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: security/server-validation
---

## Validate Inputs in Server Actions and API Routes

Always validate and sanitize inputs at the boundary. Server Actions and API Routes receive untrusted data. Use Zod schemas for type-safe validation that catch errors before they reach business logic.

**Incorrect (raw input to database):**

```tsx
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  // No validation — malformed data reaches database
  await db.user.create({ data: { name, email } })
}
```

**Correct (Zod validation at boundary):**

```tsx
// app/actions.ts
'use server'

import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function createUser(formData: FormData) {
  const parsed = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const { name, email, password } = parsed.data
  await db.user.create({ data: { name, email, password } })
  return { success: true }
}
```

For API routes, validate request bodies the same way:

```tsx
// app/api/users/route.ts
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const user = await db.user.create({ data: parsed.data })
  return NextResponse.json(user, { status: 201 })
}
```

Dataset: `dataset/security/server-validation`

Reference:
- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers
