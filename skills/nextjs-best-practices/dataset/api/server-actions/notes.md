# Use Server Actions for Mutations, Not API Routes

For form submissions and client-triggered mutations, prefer Server Actions over API routes. Server Actions run on the server, have direct database access, and integrate with Next.js caching.

## Why This Matters

- Eliminates client-side fetch boilerplate
- Automatic CSRF protection (built into Server Actions)
- Direct database access — no API layer needed
- Integrates with revalidatePath/revalidateTag
- Progressive enhancement — works without JavaScript

## When to Use

| Use Case | Approach | Reason |
|----------|----------|--------|
| Form submission | Server Action | Native HTML form support |
| Client-triggered mutation | Server Action | No API route needed |
| External webhook | API Route | Server Actions can't receive webhooks |
| File upload | API Route or Server Action | Both work, API route easier for streams |
| Real-time data sync | API Route | Server Actions are request/response only |

## Best Practices

- Always validate input with Zod before database operations
- Always check authentication before mutations
- Use revalidatePath/revalidateTag after successful mutations
- Return structured results `{ error?, success?, data? }`

## References

- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
