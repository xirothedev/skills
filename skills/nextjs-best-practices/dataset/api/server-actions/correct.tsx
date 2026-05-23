// Correct: Server Action for form mutation with validation and revalidation
// app/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional(),
})

export async function createPost(formData: FormData) {
  // Validate input
  const parsed = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Database mutation
  await db.post.create({ data: parsed.data })

  // Invalidate cache and redirect
  revalidatePath('/posts')
  revalidateTag('posts')
  redirect('/posts')
}

// ---
// Server Action called from Client Component
'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
})

export async function updateProfile(userId: string, data: { name: string; bio?: string }) {
  // Auth check
  const session = await auth()
  if (!session?.user || session.user.id !== userId) {
    return { error: 'Unauthorized' }
  }

  // Validate
  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Mutation
  await db.user.update({
    where: { id: userId },
    data: parsed.data,
  })

  // Invalidate
  revalidatePath(`/users/${userId}`)
  revalidatePath('/profile')

  return { success: true }
}

// ---
// app/create-post/page.tsx (Server Component with form action)
import { createPost } from '@/app/actions'

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <label>
        Title
        <input name="title" required />
      </label>
      <label>
        Content
        <textarea name="content" />
      </label>
      <button type="submit">Create Post</button>
    </form>
  )
}

// Key points:
// 1. Server Action replaces API route for mutations
// 2. Zod validation at the boundary
// 3. revalidatePath invalidates cached pages
// 4. revalidateTag invalidates tagged fetch calls
// 5. redirect navigates after successful mutation
// 6. Return structured errors for Client Component handling
