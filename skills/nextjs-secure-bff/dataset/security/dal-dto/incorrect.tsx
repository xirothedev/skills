// INCORRECT: A full database record is passed into a Client Component.
import ProfileCard from "./profile-card";
import { db } from "@/lib/db";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await db.user.findUniqueOrThrow({ where: { id: params.id } });
  return <ProfileCard user={user} />;
}
