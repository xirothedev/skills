// Correct: Authenticated Server Actions with ownership checks
// lib/auth.ts
import { cookies } from 'next/headers'
import { cache } from 'react'

interface Session {
  user: {
    id: string
    email: string
    role: 'user' | 'admin'
  }
}

export const getCurrentUser = cache(async (): Promise<Session['user'] | null> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  if (!sessionToken) return null

  // Verify session in database
  const session = await db.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) return null

  return session.user
})

export const requireAuth = async (): Promise<Session['user']> => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export const requireAdmin = async (): Promise<Session['user']> => {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return user
}

// ---
// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'

const updatePostSchema = z.object({
  postId: z.string(),
  title: z.string().min(1).max(200),
  content: z.string(),
})

export async function updatePost(input: unknown) {
  // 1. Authenticate user first
  const user = await requireAuth()

  // 2. Validate input
  const { postId, title, content } = updatePostSchema.parse(input)

  // 3. Check ownership
  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new Error('Post not found')
  }

  if (post.authorId !== user.id) {
    throw new Error('Forbidden: You can only edit your own posts')
  }

  // 4. Perform mutation
  const updated = await db.post.update({
    where: { id: postId },
    data: { title, content, updatedAt: new Date() },
  })

  // 5. Revalidate cache
  revalidatePath(`/posts/${postId}`)
  revalidatePath('/posts')

  return { success: true, post: updated }
}

// ---
// app/actions/admin.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

const banUserSchema = z.object({
  targetUserId: z.string(),
  reason: z.string().min(1),
})

export async function banUser(input: unknown) {
  // 1. Require admin role
  const admin = await requireAdmin()

  // 2. Validate input
  const { targetUserId, reason } = banUserSchema.parse(input)

  // 3. Check target exists and isn't already banned
  const target = await db.user.findUnique({ where: { id: targetUserId } })
  if (!target) {
    throw new Error('User not found')
  }

  if (target.bannedAt) {
    throw new Error('User is already banned')
  }

  // 4. Prevent self-ban
  if (target.id === admin.id) {
    throw new Error('Cannot ban yourself')
  }

  // 5. Perform mutation
  await db.user.update({
    where: { id: targetUserId },
    data: {
      bannedAt: new Date(),
      banReason: reason,
      bannedBy: admin.id,
    },
  })

  // 6. Log action
  console.log(`Admin ${admin.email} banned user ${target.email}: ${reason}`)

  revalidatePath('/admin/users')

  return { success: true }
}

// ---
// app/actions/comments.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'

const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(1000),
})

export async function createComment(input: unknown) {
  const user = await requireAuth()
  const { postId, content } = createCommentSchema.parse(input)

  // Verify post exists
  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new Error('Post not found')
  }

  const comment = await db.comment.create({
    data: {
      content,
      authorId: user.id,
      postId,
    },
  })

  revalidatePath(`/posts/${postId}`)

  return { success: true, commentId: comment.id }
}

export async function deleteComment(commentId: string) {
  const user = await requireAuth()

  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment) {
    throw new Error('Comment not found')
  }

  // Only comment author can delete
  if (comment.authorId !== user.id) {
    throw new Error('Forbidden: You can only delete your own comments')
  }

  await db.comment.delete({ where: { id: commentId } })

  revalidatePath(`/posts/${comment.postId}`)

  return { success: true }
}