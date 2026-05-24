// INCORRECT: The page checks admin status, but the action is still a separate entry point.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  async function deleteUser(formData: FormData) {
    "use server";
    await db.user.delete({ where: { id: String(formData.get("id")) } });
  }

  return <form action={deleteUser}>...</form>;
}
