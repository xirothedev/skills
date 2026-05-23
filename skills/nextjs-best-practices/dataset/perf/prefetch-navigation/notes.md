# Prefetch Navigation

## Automatic Prefetching in Next.js

Next.js `<Link>` components automatically prefetch routes when they enter the viewport. This pre-loads the JavaScript and data for the destination route, making navigation feel instant.

### How It Works

1. **Viewport Detection**: When a `<Link>` component enters the user's viewport, Next.js begins prefetching the linked route.
2. **Background Loading**: The route's JavaScript chunks and any required data are loaded in the background.
3. **Instant Navigation**: When the user clicks, the page is already cached, resulting in near-instant navigation.

### Next.js 16 Incremental Prefetching

In Next.js 16, prefetching became more efficient with incremental prefetching:

- Only fetches parts of a page not already in the client cache
- Reduces total transfer size for repeated navigation patterns
- Improves performance for users who navigate between similar routes frequently

### When to Disable Prefetch

Not all links should prefetch. Use `prefetch={false}` for:

- **Rare destinations**: Admin panels, settings pages, or routes users rarely visit
- **Protected routes**: Pages requiring authentication that most users won't access
- **Heavy routes**: Pages with large data payloads that waste bandwidth if unused
- **Dynamic routes**: Routes where prefetched data may become stale quickly

### Why `<a>` Tags Don't Prefetch

Standard HTML `<a>` tags bypass Next.js routing entirely:

- No prefetching occurs (Next.js cannot intercept native anchor behavior)
- Full page reload happens on click (browser navigates traditionally)
- Loses benefits of client-side navigation and route caching
- Breaks the single-page application (SPA) experience

Always use `<Link>` from `next/link` for internal navigation to maintain the prefetching optimization.