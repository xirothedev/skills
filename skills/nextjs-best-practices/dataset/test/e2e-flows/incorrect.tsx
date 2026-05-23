// Incorrect: No E2E tests at all
// tests/e2e/auth.spec.ts
// TODO: Add tests for authentication flow

// tests/e2e/posts.spec.ts
// TODO: Add tests for post creation and viewing

// tests/e2e/navigation.spec.ts
// TODO: Add tests for navigation and routing

// ---
// Problems with this approach:
// 1. No coverage of critical user flows
// 2. Authentication regressions go undetected
// 3. Form submission errors reach production
// 4. Routing changes break user paths silently
// 5. No confidence in deployments

// ---
// Another incorrect pattern: Testing only happy paths
import { test, expect } from '@playwright/test'

test('login works', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  // Missing: redirect assertion
  // Missing: error case tests
  // Missing: protected route tests
})

// Problems:
// - No assertion that login succeeded
// - No tests for invalid credentials
// - No tests for protected route redirects
// - No tests for sign out
// - Uses CSS selectors instead of accessible queries

// ---
// Another incorrect pattern: Unit tests instead of E2E for flows
// tests/unit/auth.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('Auth flow', () => {
  it('calls login API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    await login('user@example.com', 'password')

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
    })
  })
})

// Problems:
// - This is a unit test, not an E2E test
// - Doesn't test actual browser behavior
// - Doesn't test redirect after login
// - Doesn't test protected route access
// - Mocks don't catch real integration issues

// ---
// Another incorrect pattern: Flaky test with no retries
import { test, expect } from '@playwright/test'

test('sometimes works', async ({ page }) => {
  await page.goto('/dashboard')

  // No waiting for element to be ready
  await page.click('button') // Might fail if button not loaded

  // No assertions
})

// Problems:
// - No assertions to verify success
// - No retry logic for flaky elements
// - No waiting for page load
// - Test name is not descriptive