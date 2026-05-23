# Never Leak Server Environment Variables to Client

Environment variables without the `NEXT_PUBLIC_` prefix are only available in Server Components, API routes, and Server Actions. Never reference server-only env vars in Client Components or code that gets bundled for the browser.

## Why This Matters

- Server secrets (API keys, database credentials) exposed to browser are compromised
- `process.env.SECRET` in `'use client'` files is bundled into client JavaScript
- Build-time inlining makes secrets visible in source maps
- Security breach can go undetected until code is publicly deployed

## Rules

1. `NEXT_PUBLIC_*` vars are bundled and visible in browser
2. Non-prefixed vars are server-only and never bundled
3. Use `@t3-oss/env-nextjs` for validation and type safety
4. Never use server secrets in `'use client'` components

## Detection

- Audit production bundles for secret strings
- Use `next build && next analyze` to inspect output
- Enable `NODE_ENV=production` during local builds

## References

- https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- https://env.t3.gg/