---
title: Validate Webhook and Callback Requests Before Side Effects
impact: CRITICAL
impactDescription: Blocks forged callbacks, unsafe redirects, and unauthenticated cache invalidation
tags: webhooks, callbacks, signatures, redirects, revalidation
dataset: api/webhook-validation
---

## Validate Webhook and Callback Requests Before Side Effects

Webhook and callback URLs are public endpoints. Verify signatures or shared secrets, validate redirect destinations, and keep error responses generic before mutating data, setting cookies, or revalidating caches.

**Incorrect (trusts query params):**

```typescript
export async function GET(request: NextRequest) {
  revalidateTag(request.nextUrl.searchParams.get("tag")!);
  return NextResponse.json({ ok: true });
}
```

**Correct (secret and shape checks):**

```typescript
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const tag = request.nextUrl.searchParams.get("tag");
  if (token !== process.env.REVALIDATE_SECRET || !tag) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(tag);
  return NextResponse.json({ ok: true });
}
```

## Source References

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
