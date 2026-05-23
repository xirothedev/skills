# Handle Errors with error.tsx and global-error.tsx

Next.js provides built-in error boundaries using file conventions. Use `error.tsx` for route-level errors and `global-error.tsx` for app-level failures. These provide graceful error recovery and prevent broken UI.

## Why This Matters

- Automatic error catching without try/catch in every component
- Reset button allows users to retry failed operations
- Error digest enables tracking in error reporting services
- `global-error.tsx` catches layout failures that `error.tsx` cannot

## Error Boundary Hierarchy

1. `global-error.tsx` — Catches errors in root layout, must include `<html>` and `<body>`
2. `error.tsx` — Catches errors in route segment's `page.tsx` and child routes
3. `not-found.tsx` — Handles 404s triggered by `notFound()` function

## Best Practices

- Always include a reset button in `error.tsx`
- Log errors to a monitoring service
- Use error digest for correlation
- Keep error UI minimal (it's a Client Component)

## References

- https://nextjs.org/docs/app/building-your-application/routing/error-handling
- https://nextjs.org/docs/app/api-reference/file-conventions/error