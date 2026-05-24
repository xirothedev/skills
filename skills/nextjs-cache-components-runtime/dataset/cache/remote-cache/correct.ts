// CORRECT: Use remote cache for shared durable results.
import { cacheLife } from "next/cache";

export async function getReport() {
  "use cache: remote";
  cacheLife("hours");
  return buildExpensiveReport();
}
