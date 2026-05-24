// CORRECT: Derive a trusted session and send only the backend credential.
import { auth } from "@/lib/auth";
import { api } from "@/generated/api-client";

export async function getMe() {
  const session = await auth();
  return api.withToken(session.backendAccessToken).users.me();
}
