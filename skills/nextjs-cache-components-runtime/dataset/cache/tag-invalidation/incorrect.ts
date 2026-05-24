// INCORRECT: The mutation leaves the posts cache stale.
"use server";

export async function createPost(formData: FormData) {
  await db.post.create({
    data: { title: String(formData.get("title")) },
  });
}
