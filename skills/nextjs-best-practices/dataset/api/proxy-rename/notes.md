# Use proxy.ts Instead of middleware.ts (Next.js 16+)

Next.js 16 renames `middleware.ts` to `proxy.ts` to clarify its role as a network boundary. The exported function also changes from `middleware` to `proxy`.

## Why This Matters

- Clarifies the file's role as a network proxy, not general middleware
- Aligns naming with industry conventions
- Edge runtime still available — keep using `middleware.ts` if edge is needed

## When to Use

| Scenario | File | Reason |
|----------|------|--------|
| Request rewriting, auth redirects | `proxy.ts` | Standard network boundary |
| Edge runtime needed | `middleware.ts` | Edge not supported in proxy.ts |
| CORS headers | `proxy.ts` | Response modification |
| Cookie-based auth check | `proxy.ts` | Request inspection |

## Config Changes in next.config.ts

- `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
- `middlewarePrefetch` → `proxyPrefetch`
- `middlewareClientMaxBodySize` → `proxyClientMaxBodySize`

## References

- https://nextjs.org/docs/app/building-your-application/upgrading/version-16
