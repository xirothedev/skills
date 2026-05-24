// CORRECT: Cache the stable computation, not the personalized page.
import { cacheLife } from "next/cache";

async function getExpensiveStats() {
  "use cache";
  cacheLife("hours");
  return db.stats.findMany();
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = await getExpensiveStats();
  return <Dashboard user={user} stats={stats} />;
}
