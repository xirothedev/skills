// CORRECT: Next.js uses a generated client from the NestJS OpenAPI contract.
import { api } from "@/generated/api-client";

export async function createUser(name: string) {
  return api.users.createUser({
    body: { name },
  });
}
