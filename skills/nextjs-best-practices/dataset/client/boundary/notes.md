# Minimize Client Component Surface Area

Every `'use client'` component and its dependencies ship JavaScript to the browser. Push interactivity to the leaves of the component tree. Pass Server Components as children or props to Client Components to avoid bundling server-side logic.

## Why This Matters

- Client Components increase bundle size and reduce initial page load performance
- Server Components can fetch data without shipping fetch logic to the client
- Server Components passed as children of Client Components stay on the server

## Strategies

1. **Fetch in Server, interact in Client**: Server Component fetches data, passes to small Client Component for interactivity
2. **Pass Server Components as children**: Modal, tabs, and other container patterns can accept Server Components as children
3. **Push 'use client' to leaves**: Only leaf components that need interactivity should be Client Components

## Anti-Patterns to Avoid

- Entire pages marked as `'use client'`
- Fetching data in `useEffect` instead of Server Components
- Marking parent components as client when only children need interactivity

## References

- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
- https://nextjs.org/docs/app/building-your-application/rendering/client-components