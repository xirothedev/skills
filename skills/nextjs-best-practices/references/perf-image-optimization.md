---
title: Optimize Images with next/image
impact: MEDIUM
impactDescription: Serves optimized formats (WebP/AVIF), prevents layout shift, lazy-loads below-fold images
tags: image-optimization, performance, next-image
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: perf/image-optimization
---

## Optimize Images with next/image

Use the `<Image>` component instead of `<img>` for automatic optimization: format conversion, sizing, lazy loading, and blur-up placeholders.

**Incorrect (raw <img> tag):**

```tsx
export function Hero() {
  return <img src="/hero.jpg" alt="Hero banner" />
}
```

**Correct (next/image with optimization):**

```tsx
import Image from 'next/image'

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      width={1200}
      height={600}
      priority // LCP image — loads immediately, not lazy
    />
  )
}
```

Key rules:
- Always specify `width` and `height` (or `fill` with `object-fit`) to prevent layout shift
- Use `priority` ONLY for the largest above-fold image per page (LCP)
- Omit `priority` for below-fold images (lazy-loaded automatically)
- Use `sizes` for responsive images: `sizes="(max-width: 768px) 100vw, 50vw"`
- For external images, configure `remotePatterns` in `next.config.ts`:

```tsx
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'cdn.example.com' }],
  },
}
```

Dataset: `dataset/perf/image-optimization`

Reference:
- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/building-your-application/optimizing/images
