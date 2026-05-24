// INCORRECT: This shared module can be imported by client code.
import { createClient } from "@example/admin-sdk";

export const adminClient = createClient({
  apiKey: process.env.ADMIN_API_KEY!,
});
