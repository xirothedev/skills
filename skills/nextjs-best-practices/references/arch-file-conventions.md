---
title: Follow Next.js File Conventions Correctly
impact: HIGH
impactDescription: Prevents routing errors, broken layouts, and missing metadata
tags: file-conventions, app-router, metadata
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: arch/file-conventions
---

## Follow Next.js File Conventions Correctly

Next.js App Router uses specific file names with special meaning. Using the wrong name or placing files in the wrong location breaks the framework's conventions.

**Incorrect (non-standard naming):**

```
app/
├── index.tsx           # Wrong — should be page.tsx
├── main-layout.tsx     # Wrong — should be layout.tsx
├── errors.tsx          # Wrong — should be error.tsx
└── loading-ui.tsx      # Wrong — should be loading.tsx
```

**Correct (Next.js file conventions):**

```
app/
├── layout.tsx          # Root layout — wraps all routes
├── page.tsx            # Home page (/)
├── not-found.tsx       # 404 page
├── error.tsx           # Error boundary for this segment
├── loading.tsx         # Loading UI (Suspense fallback)
├── template.tsx        # Re-rendered on every navigation
├── default.tsx         # Default UI for parallel routes
├── robots.ts           # /robots.txt
├── sitemap.ts          # /sitemap.xml
└── (auth)/             # Route group — doesn't affect URL
│   ├── layout.tsx
│   └── login/page.tsx
```

Key rules:
- `page.tsx` — required for a route to be accessible
- `layout.tsx` — wraps child routes, receives `children` and route params
- `loading.tsx` — automatically wrapped in `<Suspense>`, shows while page data loads
- `error.tsx` — must be `'use client'`, catches errors in this segment
- `not-found.tsx` — renders when `notFound()` is called or route doesn't match
- `template.tsx` — like layout but re-creates on navigation (useful for animations)

Dataset: `dataset/arch/file-conventions`

Reference:
- https://nextjs.org/docs/app/api-reference/file-conventions
