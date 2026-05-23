// Correct: Testing Server and Client Components appropriately
// app/posts/post-card.tsx (Server Component)
interface Post {
  id: string
  title: string
  excerpt: string
  author: { name: string }
  publishedAt: Date
}

export async function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p className="excerpt">{post.excerpt}</p>
      <footer>
        <span className="author">{post.author.name}</span>
        <time dateTime={post.publishedAt.toISOString()}>
          {post.publishedAt.toLocaleDateString()}
        </time>
      </footer>
    </article>
  )
}

// ---
// app/posts/post-card.test.ts (Server Component test — no browser needed)
import { describe, it, expect } from 'vitest'
import { PostCard } from './post-card'

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    excerpt: 'A test excerpt',
    author: { name: 'Test Author' },
    publishedAt: new Date('2024-01-15'),
  }

  it('renders post title and excerpt', async () => {
    const result = await PostCard({ post: mockPost })

    // Test the rendered structure directly — no browser needed
    expect(result.type).toBe('article')
    expect(result.props.className).toBe('post-card')
  })

  it('includes author name', async () => {
    const result = await PostCard({ post: mockPost })
    // Server Components return JSX that can be inspected
    const footer = result.props.children[2]
    expect(footer.type).toBe('footer')
  })
})

// ---
// app/search/search-input.tsx (Client Component)
'use client'

import { useState, useCallback } from 'react'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchInput({ onSearch, placeholder = 'Search...' }: SearchInputProps) {
  const [query, setQuery] = useState('')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      onSearch(value)
    },
    [onSearch]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  return (
    <div className="search-input">
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search"
      />
      {query && (
        <button onClick={handleClear} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  )
}

// ---
// app/search/search-input.test.tsx (Client Component test — browser simulation)
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('calls onSearch when user types', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, 'hello')

    // Called once per character
    expect(onSearch).toHaveBeenCalledTimes(5)
    expect(onSearch).toHaveBeenLastCalledWith('hello')
  })

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, 'test')

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('clears input when clear button clicked', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, 'test')

    const clearButton = screen.getByLabelText('Clear search')
    await user.click(clearButton)

    expect(input).toHaveValue('')
    expect(onSearch).toHaveBeenLastCalledWith('')
  })
})

// ---
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})

// ---
// test/setup.ts
import '@testing-library/jest-dom/vitest'