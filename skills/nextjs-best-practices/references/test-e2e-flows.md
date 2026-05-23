---
title: Use Playwright for End-to-End Testing
impact: MEDIUM
impactDescription: Catches routing, auth, and data flow issues that unit tests miss
tags: testing, e2e, playwright
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: test/e2e-flows
---

## Use Playwright for End-to-End Testing

Next.js apps have server-rendered content, client interactivity, navigation, and data fetching. E2E tests with Playwright catch integration issues across all these layers.

**Setup:**

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'next dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  testDir: 'tests/e2e',
})
```

**Example test:**

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign in and view dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
})

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
```

Key flows to test:
- Authentication: login, logout, protected routes, redirects
- Data mutations: form submissions, Server Actions, error states
- Navigation: route groups, dynamic params, 404 pages
- Responsive: mobile vs desktop layouts

Dataset: `dataset/test/e2e-flows`

Reference:
- https://nextjs.org/docs/app/building-your-application/testing
- https://playwright.dev/docs/intro
