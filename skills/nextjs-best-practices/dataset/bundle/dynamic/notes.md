# Lazy-Load Heavy Components with next/dynamic

Use `next/dynamic` to defer loading of components not needed on initial render. This reduces the initial JavaScript bundle and improves Time to Interactive (TTI).

## Why This Matters

- Heavy libraries (editors, charts, rich UI kits) bloat the initial bundle
- Users on slow networks wait longer for interactive content
- `next/dynamic` splits the component into a separate chunk loaded on demand
- `ssr: false` prevents server-side rendering errors for browser-only components

## When to Use

| Component Type | Use dynamic? | Reason |
|----------------|-------------|--------|
| Rich text editor | Yes | Large bundle, needs DOM APIs |
| Chart/data visualization | Yes | Heavy math rendering, not above-fold |
| Modal/dialog | Yes | Only needed on user interaction |
| Markdown renderer | Conditional | If used on every page, skip dynamic |
| Simple button/input | No | Small, needed immediately |

## Best Practices

- Always provide a `loading` placeholder for smooth UX
- Use `ssr: false` only when the component truly needs browser APIs
- Don't over-dynamic-import — each chunk adds a network request
- Combine with `Suspense` for server-side lazy loading

## References

- https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- https://nextjs.org/docs/app/api-reference/functions/dynamic
