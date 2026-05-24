// CORRECT: A server-only DAL authorizes and returns a minimal DTO.
import ProfileCard from "./profile-card";
import { getProfileDTO } from "@/data/profile";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfileDTO(params.id);
  return <ProfileCard profile={profile} />;
}
