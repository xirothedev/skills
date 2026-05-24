// CORRECT: Expire the tag immediately for read-your-own-writes.
"use server";

import { updateTag } from "next/cache";

export async function createPost(formData: FormData) {
  await db.post.create({
    data: { title: String(formData.get("title")) },
  });

  updateTag("posts");
}
