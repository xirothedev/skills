'use server'

import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function createUser(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { error: parsed.error.flatten() }
  await db.user.create({ data: parsed.data })
  return { success: true }
}
