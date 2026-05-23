---
title: Test Server and Client Components Appropriately
impact: MEDIUM
impactDescription: Tests the right boundaries — server logic on server, client interactivity in browser
tags: testing, server-components, client-components
versionScope: "14.x.x, 15.x.x, 16.x.x"
dataset: test/component-units
---

## Test Server and Client Components Appropriately

Server and Client Components require different testing approaches. Test Server Components for data rendering and composition. Test Client Components for interactivity and state.

**Server Component testing (render + verify output):**

```tsx
// app/posts/post-card.test.tsx
import { describe, it, expect } from 'vitest'
import { PostCard } from './post-card'

describe('PostCard', () => {
  it('renders post title and excerpt', async () => {
    const post = { id: '1', title: 'Hello', excerpt: 'World' }
    const result = await PostCard({ post })
    expect(result.type).toBe('article')
    // Test rendering logic directly — no browser needed
  })
})
```

**Client Component testing (interactivity):**

```tsx
// app/search/search-input.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('filters results on input', async () => {
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await userEvent.type(input, 'hello')

    expect(onSearch).toHaveBeenCalledWith('hello')
  })
})
```

Testing stack recommendation:
- **Unit**: Vitest + @testing-library/react
- **E2E**: Playwright
- **Component**: Storybook 8+

Do NOT test Server Components with browser automation — they render on the server with zero client JavaScript.

Dataset: `dataset/test/component-units`

Reference:
- https://nextjs.org/docs/app/building-your-application/testing
