// Correct: Comprehensive E2E tests with Playwright
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})

// ---
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign in with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('correct-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
  })

  test('user sees error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Verify error message
    await expect(page.getByRole('alert')).toContainText('Invalid credentials')
    await expect(page).toHaveURL('/login')
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login?callbackUrl=%2Fdashboard')
  })

  test('user can sign out', async ({ page }) => {
    // Setup: sign in first
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('correct-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')

    // Sign out
    await page.getByRole('button', { name: 'Sign out' }).click()

    // Should be on home page, no access to dashboard
    await expect(page).toHaveURL('/')
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})

// ---
// tests/e2e/posts.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Posts', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('correct-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('user can create a new post', async ({ page }) => {
    await page.goto('/posts/new')

    await page.getByLabel('Title').fill('My New Post')
    await page.getByLabel('Content').fill('This is the content of my post.')
    await page.getByRole('button', { name: 'Publish' }).click()

    // Verify redirect to post page
    await expect(page).toHaveURL(/\/posts\/[\w-]+/)
    await expect(page.getByRole('heading', { name: 'My New Post' })).toBeVisible()
  })

  test('user sees validation errors for empty fields', async ({ page }) => {
    await page.goto('/posts/new')

    await page.getByRole('button', { name: 'Publish' }).click()

    await expect(page.getByText('Title is required')).toBeVisible()
    await expect(page.getByText('Content is required')).toBeVisible()
  })

  test('user can view a post', async ({ page }) => {
    await page.goto('/posts/existing-post')

    await expect(page.getByRole('article')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('user sees 404 for non-existent post', async ({ page }) => {
    await page.goto('/posts/non-existent-post-id')

    await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible()
  })
})

// ---
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('responsive mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu should be hidden initially
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).not.toBeVisible()

    // Open mobile menu
    await page.getByRole('button', { name: 'Menu' }).click()

    // Links should now be visible
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible()
  })
})