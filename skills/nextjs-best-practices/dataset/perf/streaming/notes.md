# Suspense-Based Streaming in Next.js

## Core Concept

Wrap slow or data-dependent components in `<Suspense>` to stream HTML to the client as it becomes ready. This enables progressive rendering — users see critical content immediately while slower parts load in the background.

## Why It Matters

- **Faster perceived performance**: Users see something useful immediately
- **No waterfall loading**: Each section streams independently when ready
- **Better UX**: Progressive disclosure of content matches user expectations
- **Resilience**: Slow queries don't block fast content from rendering

## Progressive Rendering

When a page uses Suspense boundaries, Next.js:

1. Sends the shell (static parts + fallbacks) immediately
2. Streams each Suspense-wrapped section as its data resolves
3. Replaces fallbacks with real content via streaming HTML

```
Timeline without Suspense:
[======== all data loading ========] -> render complete page

Timeline with Suspense:
[fast data] -> render fast content immediately
[========== slow data ==========] -> stream slow content when ready
```

## Nested Suspense Boundaries

Nest Suspense boundaries to control streaming order of importance:

```tsx
<Suspense fallback={<MainSkeleton />}>
  <MainContent />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar /> {/* renders after MainContent */}
  </Suspense>
</Suspense>
```

**Streaming order:**
1. Outer fallback shows first
2. MainContent streams when ready (outer boundary resolves)
3. Sidebar fallback shows, then Sidebar streams when ready

This ensures critical content (main article, product details) appears before secondary content (recommendations, related items).

## Async Server Components

Async Server Components work naturally with Suspense:

- Component fetches its own data internally
- Wrapped in Suspense at the call site
- Streams independently when data resolves

```tsx
// Component fetches data
async function Comments() {
  const comments = await getComments() // slow
  return <CommentList comments={comments} />
}

// Parent wraps in Suspense
<Suspense fallback={<CommentsSkeleton />}>
  <Comments />
</Suspense>
```

## Loading Fallbacks

Design meaningful fallbacks:

- **Skeletons**: Match layout and dimensions of actual content
- **Spinners**: Use for indeterminate loading times
- **Progressive placeholders**: Show structure before content

```tsx
function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded mt-2" />
        </div>
      ))}
    </div>
  )
}
```

## Key Takeaways

1. Wrap slow/data-dependent components in individual Suspense boundaries
2. Let fast content render immediately without waiting for slow queries
3. Use nested Suspense to control streaming priority
4. Design fallbacks that match content structure
5. Each async Server Component can be its own streaming boundary