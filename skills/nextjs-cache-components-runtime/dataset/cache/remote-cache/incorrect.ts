// INCORRECT: Assumes in-memory cache is durable across serverless instances.
import { cacheLife } from "next/cache";

export async function getReport() {
  "use cache";
  cacheLife("hours");
  return buildExpensiveReport();
}
