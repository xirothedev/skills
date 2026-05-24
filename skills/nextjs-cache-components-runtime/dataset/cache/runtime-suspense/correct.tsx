// CORRECT: Runtime data streams inside a Suspense boundary.
import { Suspense } from "react";
import { cookies } from "next/headers";

async function ThemePanelFromCookie() {
  const theme = (await cookies()).get("theme")?.value ?? "light";
  return <ThemePanel theme={theme} />;
}

export default function Page() {
  return (
    <Suspense fallback={<ThemePanelSkeleton />}>
      <ThemePanelFromCookie />
    </Suspense>
  );
}
