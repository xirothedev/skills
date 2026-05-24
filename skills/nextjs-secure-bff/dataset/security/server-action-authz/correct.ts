// CORRECT: The Server Action re-authenticates and delegates authorization to the DAL.
"use server";

import { auth } from "@/lib/auth";
import { deleteUserAsAdmin } from "@/data/users";

export async function deleteUserAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("Forbidden");
  }

  await deleteUserAsAdmin({
    actorId: session.user.id,
    userId: String(formData.get("id")),
  });

  return { ok: true };
}
