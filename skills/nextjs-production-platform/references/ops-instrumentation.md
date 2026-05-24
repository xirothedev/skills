---
title: Put Production Instrumentation in Next.js Instrumentation Files
impact: HIGH
impactDescription: Ensures telemetry starts once at runtime startup instead of inside render paths
tags: instrumentation, opentelemetry, logging, startup, observability
dataset: ops/instrumentation
---

## Put Production Instrumentation in Next.js Instrumentation Files

Initialize telemetry in `instrumentation.ts` or `instrumentation.js`, not inside components, Route Handlers, or Server Actions. Keep instrumentation idempotent and environment-aware.

**Incorrect (initializes during render):**

```typescript
export default function Layout({ children }: Props) {
  startTelemetry();
  return <html><body>{children}</body></html>;
}
```

**Correct (runtime startup hook):**

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
```

## Source References

- https://nextjs.org/docs/app/guides/instrumentation
- https://nextjs.org/docs/app/guides/open-telemetry
