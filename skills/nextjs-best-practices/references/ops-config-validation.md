---
title: Validate Next.js Config at Build Time
impact: MEDIUM
impactDescription: Catches misconfiguration early, prevents runtime errors from bad config
tags: configuration, validation, next-config
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: ops/config-validation
---

## Validate Next.js Config at Build Time

Use TypeScript in `next.config.ts` and validate environment variables at startup. Next.js config errors are hard to debug at runtime.

**Incorrect (no config validation):**

```ts
// next.config.js
module.exports = {
  env: {
    API_URL: process.env.API_URL, // No validation — undefined at runtime if missing
  },
}
```

**Correct (TypeScript config with env validation):**

```ts
// next.config.ts
import type { NextConfig } from 'next'
import { env } from './env'

const nextConfig: NextConfig = {
  env: {
    API_URL: env.API_URL,
  },
  // TypeScript catches config typos at build time
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
}

export default nextConfig
```

```ts
// env.ts — validated at startup
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    API_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: {
    API_URL: process.env.API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
})
```

For production builds, add a config check:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone', // For Docker deployments
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
}
```

Dataset: `dataset/ops/config-validation`

Reference:
- https://nextjs.org/docs/app/api-reference/config/next-config-js
- https://nextjs.org/docs/app/building-your-application/configuring/typescript
