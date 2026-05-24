---
title: Align Docker Runtime with Next.js Output Mode
impact: CRITICAL
impactDescription: Prevents production images from missing traced files or running the wrong package manager/runtime
tags: docker, standalone, output, runtime, deployment
dataset: deploy/standalone-docker
---

## Align Docker Runtime with Next.js Output Mode

If `output: "standalone"` is enabled, the production image should copy the traced standalone server, static assets, and public assets, then run the generated server with Node. Do not assume dev package-manager commands exist in the runtime image.

**Incorrect (ships source and runs dev command):**

```dockerfile
CMD ["bun", "run", "start"]
```

**Correct (runs standalone server):**

```dockerfile
CMD ["node", "server.js"]
```

## Source References

- https://nextjs.org/docs/app/getting-started/deploying
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output
