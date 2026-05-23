# Use Playwright for End-to-End Testing

Next.js apps have server-rendered content, client interactivity, navigation, and data fetching. E2E tests with Playwright catch integration issues across all these layers.

## Why This Matters

- Unit tests miss routing and authentication flows
- Server Components need browser testing for full rendering
- Catches regressions in critical user journeys
- Validates actual browser behavior, not mocked components

## Key Flows to Test

1. **Authentication**: login, logout, protected routes, redirects
2. **Mutations**: form submissions, Server Actions, error states
3. **Navigation**: route groups, dynamic params, 404 pages
4. **Responsive**: mobile vs desktop layouts

## Best Practices

- Test critical paths, not every component
- Use page object models for maintainability
- Mock external APIs for reliability
- Run in CI with parallel workers

## References

- https://nextjs.org/docs/app/building-your-application/testing
- https://playwright.dev/docs/intro