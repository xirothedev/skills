// Incorrect: Server Actions without authentication checks
// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

// CRITICAL: No authentication check
// Anyone can call this action and delete any post
export async function deletePost(postId: string) {
  await db.post.delete({ where: { id: postId } })
  revalidatePath('/posts')
  return { success: true }
}

// CRITICAL: No ownership check
// Any authenticated user can edit any post
export async function updatePost(postId: string, title: string, content: string) {
  const updated = await db.post.update({
    where: { id: postId },
    data: { title, content },
  })
  revalidatePath(`/posts/${postId}`)
  return { success: true, post: updated }
}

// ---
// app/actions/admin.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

// CRITICAL: No admin check
// Any user can ban other users
export async function banUser(targetUserId: string) {
  await db.user.update({
    where: { id: targetUserId },
    data: { bannedAt: new Date() },
  })
  revalidatePath('/admin/users')
  return { success: true }
}

// CRITICAL: No input validation
// Any user can grant admin to anyone
export async function grantAdmin(targetUserId: string) {
  await db.user.update({
    where: { id: targetUserId },
    data: { role: 'admin' },
  })
  return { success: true }
}

// ---
// app/actions/users.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

// CRITICAL: No auth check
// Anyone can view all users including sensitive data
export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      // Leaking sensitive fields
      passwordHash: true,
      createdAt: true,
    },
  })
}

// CRITICAL: No auth or ownership check
// Anyone can update any user's profile
export async function updateUserEmail(userId: string, newEmail: string) {
  await db.user.update({
    where: { id: userId },
    data: { email: newEmail },
  })
  revalidatePath('/profile')
  return { success: true }
}

// ---
// Example attack: Calling unprotected action from browser console
// An attacker can open DevTools and run:
const response = await fetch('/_next/action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Action ID found in page source
    $ACTION_ID_deletePost: '...',
    postId: 'victim-post-id',
  }),
})

// Or using a malicious script:
fetch('/api/actions', {
  method: 'POST',
  body: JSON.stringify({
    action: 'banUser',
    targetUserId: 'user-to-ban',
  }),
})

// ---
// Another incorrect pattern: Trusting client-side data
'use server'

import { db } from '@/lib/db'

// WRONG: Trusting userId from client
export async function updateProfile(data: { userId: string; name: string }) {
  // Client can send any userId — privilege escalation
  await db.user.update({
    where: { id: data.userId },
    data: { name: data.name },
  })
  return { success: true }
}

// CORRECT: Get user from session
import { requireAuth } from '@/lib/auth'

export async function updateProfileCorrect(data: { name: string }) {
  const user = await requireAuth()
  await db.user.update({
    where: { id: user.id },
    data: { name: data.name },
  })
  return { success: true }
}

// ---
// Another incorrect pattern: No error handling
'use server'

import { db } from '@/lib/db'

export async function getPost(postId: string) {
  // No try/catch, no validation
  // postId could be anything — SQL injection possible
  const post = await db.$queryRaw`
    SELECT * FROM posts WHERE id = ${postId}
  `
  return post
}

// No rate limiting — DoS attack possible
export async function searchPosts(query: string) {
  return db.post.findMany({
    where: { title: { contains: query } },
    // No pagination limit
  })
}