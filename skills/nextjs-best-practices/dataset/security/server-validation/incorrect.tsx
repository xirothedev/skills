'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')
  // No validation — raw input goes to database
  await db.user.create({ data: { name, email, password } })
}
