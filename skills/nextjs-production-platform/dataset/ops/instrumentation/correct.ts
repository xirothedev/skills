// CORRECT: Next.js instrumentation starts telemetry at runtime startup.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
