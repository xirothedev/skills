# Validate Next.js Config at Build Time

Use TypeScript in `next.config.ts` and validate environment variables at startup. Configuration errors are hard to debug at runtime and can cause cryptic failures in production.

## Why This Matters

- Type errors in config caught at build time, not runtime
- Missing env vars fail fast, not in production
- `@t3-oss/env-nextjs` provides runtime validation with Zod schemas
- TypeScript config enables IDE autocomplete and type checking

## Best Practices

1. Use `next.config.ts` instead of `next.config.js`
2. Validate environment variables with Zod schemas
3. Separate server and client env vars
4. Fail build/startup on missing or invalid env vars

## References

- https://nextjs.org/docs/app/api-reference/config/next-config-js
- https://nextjs.org/docs/app/building-your-application/configuring/typescript
- https://env.t3.gg/