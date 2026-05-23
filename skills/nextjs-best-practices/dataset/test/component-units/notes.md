# Test Server and Client Components Appropriately

Server and Client Components require different testing strategies. Test Server Components for data rendering and composition without a browser. Test Client Components for interactivity, state, and user events.

## Why This Matters

- Server Components have zero client JavaScript — browser testing is wasteful
- Client Components need DOM testing for user interactions
- Different boundaries require different test tools
- Unit tests catch logic errors; E2E tests catch integration issues

## Testing Stack

| Component Type | Test Tool | What to Test |
|----------------|-----------|--------------|
| Server Component | Vitest (direct) | Rendering output, data fetching |
| Client Component | @testing-library/react | User interactions, state |
| Integration | Playwright | Full user flows, routing |
| Visual | Storybook 8+ | Component variants, accessibility |

## Best Practices

- Test Server Components for what they render, not how
- Test Client Components for user interactions
- Mock external dependencies (databases, APIs)
- Avoid testing implementation details

## References

- https://nextjs.org/docs/app/building-your-application/testing
- https://testing-library.com/docs/react-testing-library/intro/