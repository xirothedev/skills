// INCORRECT: Runtime cookie access is not isolated behind Suspense.
import { cookies } from "next/headers";

export default async function Page() {
  const theme = (await cookies()).get("theme")?.value ?? "light";
  return <ThemePanel theme={theme} />;
}
