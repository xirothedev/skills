---
title: Keep Route Handlers at the Public Boundary
impact: CRITICAL
impactDescription: Prevents public endpoints from becoming unvalidated internal service calls
tags: route-handlers, bff, validation, errors, public-api
dataset: api/route-boundaries
---

## Keep Route Handlers at the Public Boundary

Route Handlers are public HTTP endpoints. They should validate request method, content type, payload shape, and authorization before calling internal services.

**Incorrect (raw payload and internal error leak):**

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const result = await createInvoice(body);
  return Response.json(result);
}
```

**Correct (validated public contract):**

```typescript
export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return Response.json({ error: "Unsupported media type" }, { status: 415 });
  }

  const body = await request.json();
  const input = createInvoiceSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  await createInvoice(input.data);
  return Response.json({ ok: true }, { status: 201 });
}
```

## Source References

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/api-reference/file-conventions/route
