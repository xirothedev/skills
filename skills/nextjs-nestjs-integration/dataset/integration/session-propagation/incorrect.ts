// INCORRECT: Forwards all browser headers to the backend.
import { headers } from "next/headers";

export async function getMe() {
  return fetch(`${process.env.NEXT_SERVER_API_ORIGIN}/me`, {
    headers: await headers(),
  });
}
