---
title: Separate Upstream Request Headers from Client Response Headers
impact: HIGH
impactDescription: Prevents leaking cookies, credentials, and internal routing data to clients
tags: proxy, headers, rewrites, response, upstream
dataset: api/proxy-headers
---

## Separate Upstream Request Headers from Client Response Headers

Proxy can modify the request that reaches the server or the response that goes to the client. Do not forward incoming headers wholesale, and never put sensitive upstream headers into client-visible response headers.

**Incorrect (leaks all request headers):**

```typescript
export function proxy(request: NextRequest) {
  return NextResponse.next({ headers: request.headers });
}
```

**Correct (allowlist upstream headers only):**

```typescript
export function proxy(request: NextRequest) {
  const headers = new Headers();
  headers.set("x-request-id", crypto.randomUUID());
  return NextResponse.next({ request: { headers } });
}
```

## Source References

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
