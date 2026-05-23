---
title: Avoid Barrel File Imports
impact: MEDIUM
impactDescription: Prevents unnecessary JavaScript from being bundled when only one export is needed
tags: bundle-optimization, imports, tree-shaking
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: bundle/barrel-imports
---

## Avoid Barrel File Imports

Barrel files (`index.ts` that re-export from multiple modules) prevent tree-shaking. Import directly from the source file to keep the client bundle small.

**Incorrect (barrel file import):**

```tsx
// components/index.ts — barrel file
export * from './button'
export * from './modal'
export * from './sidebar'
export * from './chart'

// app/page.tsx
import { Button } from '@/components' // Bundles ALL components
```

**Correct (direct import):**

```tsx
// app/page.tsx
import { Button } from '@/components/button' // Only Button bundled
```

This matters especially for:
- Third-party libraries (import from `lodash/debounce` not `lodash`)
- UI component libraries (import from `@/components/button` not `@/components`)
- Icon libraries (use direct icon imports, not barrel)

Dataset: `dataset/bundle/barrel-imports`

Reference:
- https://nextjs.org/docs/app/building-your-application/optimizing/bundle-size
