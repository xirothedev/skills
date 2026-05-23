// Incorrect: Testing Server Components with browser automation (wasteful)
// app/posts/post-card.test.ts (WRONG — using browser for server-only code)
import { test, expect } from '@playwright/test'

test('PostCard renders post data', async ({ page }) => {
  // WRONG: Spinning up a browser to test a Server Component
  // Server Components have zero client JS — this is overkill
  await page.goto('/posts/test-post')

  await expect(page.locator('article.post-card h2')).toContainText('Test Post')
  await expect(page.locator('.excerpt')).toBeVisible()
})

// Problems:
// 1. Slow — browser startup + page load for every test
// 2. Wasteful — Server Components don't need DOM
// 3. Brittle — depends on network, server state
// 4. Wrong boundary — testing routing, not component logic

// ---
// Another incorrect pattern: Testing implementation details
// app/search/search-input.test.tsx (WRONG — testing internals)
import { render, screen } from '@testing-library/react'
import { SearchInput } from './search-input'

describe('SearchInput (wrong approach)', () => {
  it('uses useState hook', () => {
    // WRONG: Testing implementation detail
    // This is brittle and doesn't test user-visible behavior
    const { rerender } = render(<SearchInput onSearch={vi.fn()} />)

    // Testing internal state is an anti-pattern
    // Users don't care about state, they care about behavior
  })

  it('has correct initial state', () => {
    // WRONG: Testing state value, not rendered output
    const { container } = render(<SearchInput onSearch={vi.fn()} />)

    // Querying DOM directly instead of using accessible queries
    const input = container.querySelector('input')
    expect(input?.value).toBe('')
  })
})

// ---
// Correct approach for comparison:
// test user behavior, not implementation

// ---
// Another incorrect pattern: Not testing async Server Components correctly
import { describe, it, expect } from 'vitest'
import { PostCard } from './post-card'

describe('PostCard (wrong approach)', () => {
  it('renders post', () => {
    // WRONG: Not awaiting the async Server Component
    const result = PostCard({ post: mockPost }) // Missing await

    // This will fail — Server Components are async
    expect(result.type).toBe('article')
  })
})

// ---
// Incorrect: Testing at the wrong level
// app/posts/page.test.ts
import { test, expect } from '@playwright/test'

test('posts page shows posts', async ({ page }) => {
  // This is an E2E test, not a unit test
  // It's fine for E2E but wrong for testing individual components
  await page.goto('/posts')

  // If you want to test PostCard specifically, do it in unit tests
  // E2E tests should cover user flows, not component behavior
  const posts = page.locator('article')
  await expect(posts).toHaveCount(10) // Why 10? This is a magic number
})

// Problems:
// 1. E2E tests are slow and expensive
// 2. Use E2E for user flows, not component unit tests
// 3. This doesn't isolate the component being tested