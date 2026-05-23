# File Conventions Dataset

Use this case when structuring App Router routes with proper file conventions.

## Core File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI — renders for matching path |
| `layout.tsx` | Shared UI — wraps child routes, preserves state |
| `loading.tsx` | Suspense fallback — shows during async operations |
| `error.tsx` | Error boundary — catches route segment errors |
| `not-found.tsx` | 404 UI — renders when `notFound()` called |
| `template.tsx` | Re-render wrapper — like layout but remounts on navigation |
| `route.ts` | API endpoint — handles HTTP methods, returns Response |

## Special Files

| File | Purpose |
|------|---------|
| `metadata.ts` | Static metadata export (rare — usually inline) |
| `robots.ts` | Generate robots.txt dynamically |
| `sitemap.ts` | Generate sitemap.xml dynamically |

## Route Groups

Use parentheses `(group)` to organize routes without affecting URL:
```
app/
├── (marketing)/
│   ├── about/page.tsx      # /about
│   └── contact/page.tsx    # /contact
└── (shop)/
    ├── products/page.tsx   # /products
    └── cart/page.tsx       # /cart
```

## Incorrect (Wrong file names)

```
app/
├── index.tsx              # Wrong — use page.tsx
├── main-layout.tsx        # Wrong — use layout.tsx
├── products/
│   ├── Index.tsx          # Wrong — use page.tsx (case matters)
│   └── product-layout.tsx # Wrong — use layout.tsx
└── api/
    └── users.ts           # Wrong — use route.ts
```

## Correct (Proper conventions)

```
app/
├── layout.tsx             # Root layout (required)
├── page.tsx               # Home page (/)
├── loading.tsx            # Loading state for home
├── error.tsx              # Error boundary for home
├── not-found.tsx          # 404 page
├── products/
│   ├── layout.tsx         # Nested layout for /products/*
│   ├── page.tsx           # /products
│   ├── loading.tsx        # Loading for /products
│   ├── [id]/
│   │   └── page.tsx       # /products/:id
│   └── (admin)/
│       └── dashboard/
│           └── page.tsx   # /products/dashboard (grouped)
├── api/
│   └── users/
│       └── route.ts       # /api/users endpoint
├── robots.ts              # Dynamic robots.txt
└── sitemap.ts             # Dynamic sitemap.xml
```

Key rules:
- `page.tsx` is the only file that creates a publicly accessible route
- `layout.tsx` must accept `children` prop
- Files are case-sensitive — `Page.tsx` is NOT `page.tsx`
- Parentheses create route groups that don't affect URL structure