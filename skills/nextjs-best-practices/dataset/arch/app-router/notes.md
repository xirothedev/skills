# App Router Dataset

Use this case when deciding between App Router (`app/`) and Pages Router (`pages/`).

## Incorrect (Pages Router for new project)

```
pages/
├── index.tsx          # uses getServerSideProps
├── posts/
│   ├── index.tsx      # uses getStaticProps
│   └── [id].tsx       # uses getStaticPaths
└── api/
    └── posts.ts       # API route handler
```

## Correct (App Router for new project)

```
app/
├── layout.tsx         # root layout with providers
├── page.tsx           # Server Component, async data fetch
├── posts/
│   ├── page.tsx       # Server Component list
│   ├── [id]/
│   │   └── page.tsx   # Server Component with generateStaticParams
│   └── loading.tsx    # Suspense fallback
└── api/
    └── posts/
        └── route.ts   # typed route handler
```

Key differences:
- App Router uses Server Components by default (no `'use client'` needed)
- Data fetching uses `fetch()` directly in components, not `getServerSideProps`
- Route handlers replace `/api/*` pages
- `loading.tsx` and `error.tsx` replace manual Suspense/error boundaries
- `generateStaticParams` replaces `getStaticPaths`
