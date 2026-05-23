---
title: Optimize Fonts with next/font
impact: HIGH
impactDescription: Eliminates external font requests, prevents layout shift, self-hosts fonts for better performance
tags: font-optimization, performance, next-font
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: bundle/font-optimization
---

## Optimize Fonts with next/font

Use `next/font` to self-host and optimize web fonts. Next.js automatically inlines font CSS at build time, eliminating external network requests and preventing flash of invisible/unstyled text (FOIT/FOUT).

**Incorrect (external font link in layout):**

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter">{children}</body>
    </html>
  )
}
```

**Correct (next/font with automatic self-hosting):**

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

For local fonts, use `next/font/local`:

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  weight: '400 700',
  variable: '--font-heading',
})
```

`next/font` also sets `display: 'swap'` automatically and generates optimal `font-display` rules.

Dataset: `dataset/bundle/font-optimization`

Reference:
- https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- https://nextjs.org/docs/app/api-reference/font
