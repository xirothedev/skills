// INCORRECT: The whole page is cached, including user-specific data.
import { cacheLife } from "next/cache";

export default async function DashboardPage() {
  "use cache";
  cacheLife("hours");

  const user = await getCurrentUser();
  const stats = await getExpensiveStats();

  return <Dashboard user={user} stats={stats} />;
}
