// CORRECT: Secrets and privileged SDK clients stay behind a server-only module.
import "server-only";
import { createClient } from "@example/admin-sdk";

export function getAdminClient() {
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    throw new Error("ADMIN_API_KEY is not configured");
  }
  return createClient({ apiKey });
}
