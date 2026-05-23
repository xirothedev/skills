# Optimize Images with next/image

Use the `<Image>` component instead of `<img>` for automatic optimization: format conversion (WebP/AVIF), responsive sizing, lazy loading, and blur-up placeholders.

## Why This Matters

- Raw `<img>` tags serve full-size, original-format images — wasteful
- `next/image` auto-converts to modern formats (WebP/AVIF) — 30-50% smaller
- Prevents Cumulative Layout Shift (CLS) by enforcing dimensions
- Lazy-loads below-fold images — saves bandwidth
- Blur-up placeholders improve perceived performance

## Key Rules

| Rule | Why |
|------|-----|
| Always specify `width` + `height` (or `fill` + `object-fit`) | Prevents layout shift |
| Use `priority` ONLY for LCP image | Above-fold image should not be lazy |
| Omit `priority` for below-fold images | Lazy-loaded automatically |
| Use `sizes` for responsive images | Browser picks correct resolution |
| Configure `remotePatterns` for external images | Security: whitelist allowed hosts |

## When to Use `priority`

- Largest image above fold (LCP element)
- Hero banners, product main images
- NOT for gallery thumbnails, avatars, icons

## References

- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/building-your-application/optimizing/images
