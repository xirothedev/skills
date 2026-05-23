# Font Optimization with next/font

## Overview

`next/font` is a built-in Next.js module that optimizes web fonts by self-hosting them, eliminating external network requests and improving Core Web Vitals. It automatically handles font CSS inlining at build time and prevents layout shift caused by font loading.

## Key Benefits

### Automatic Self-Hosting

Fonts are downloaded at build time and served from your domain, eliminating requests to third-party font providers like Google Fonts. This improves:
- **Privacy compliance** — No requests to external domains
- **Performance** — No DNS resolution, connection, or TLS handshake overhead
- **Reliability** — No dependency on external service availability

### FOIT/FOUT Prevention

`next/font` automatically applies `display: swap`, ensuring:
- **FOIT (Flash of Invisible Text)** — Text remains invisible while font loads, causing poor UX
- **FOUT (Flash of Unstyled Text)** — Fallback font displays immediately, swaps when custom font loads

With `display: swap`, users see text immediately in a fallback font, then see the custom font once loaded. This prevents layout shift and improves Largest Contentful Paint (LCP).

### Zero Layout Shift

Font files are inlined as base64 in the CSS at build time for small fonts, or preloaded for larger fonts. Combined with `display: swap`, this eliminates Cumulative Layout Shift (CLS) from font loading.

## Google Fonts (next/font/google)

Import any font from Google Fonts directly:

```tsx
import { Inter, Roboto, Open_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],           // Character subsets to include
  weight: ['400', '700'],       // Specific weights (optional, defaults to all)
  style: ['normal', 'italic'],  // Font styles (optional)
  display: 'swap',              // Font display strategy
  variable: '--font-inter',     // CSS variable for Tailwind integration
  preload: true,                // Preload font (default: true)
})
```

### Subset Optimization

Only include the characters you need:
- `subsets: ['latin']` — Basic Latin characters (~20KB)
- `subsets: ['latin', 'latin-ext']` — Extended Latin for European languages
- Without subsets, all characters are included (~100KB+)

## Local Fonts (next/font/local)

Self-host custom fonts from your project:

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: './fonts/MyFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/MyFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
})
```

### Supported Formats

- **WOFF2** — Recommended, best compression
- **WOFF** — Legacy support
- **OTF/TTF** — Uncompressed, not recommended

## CSS Variable Integration

`next/font` generates a CSS variable for seamless Tailwind CSS integration:

```tsx
// layout.tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// Apply to html element
<html className={inter.variable}>

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
}
```

## Best Practices

1. **Always define subsets** — Reduces font file size significantly
2. **Use `variable` prop** — Enables Tailwind CSS integration
3. **Load fonts in root layout** — Ensures font is available for entire app
4. **Limit weights** — Only include weights you actually use
5. **Use WOFF2** — Best compression, widest browser support

## Anti-Patterns to Avoid

- External `<link>` to Google Fonts — Defeats self-hosting benefits
- CSS `@import` for fonts — Render-blocking, causes FOIT
- Missing `font-display: swap` — Text invisible during font load
- Loading all font weights — Unnecessary bytes transferred