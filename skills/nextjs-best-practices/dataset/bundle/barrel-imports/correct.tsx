/**
 * CORRECT: Direct Imports for Optimal Bundle Size
 *
 * Each import pulls only what's needed from the source file,
 * allowing the bundler to tree-shake unused code.
 */

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { Sidebar } from '@/components/sidebar'

// Third-party libraries: import specific functions
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import cloneDeep from 'lodash/cloneDeep'

// Icon libraries: direct icon imports
import { UserIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { HomeIcon } from '@heroicons/react/24/solid'

// Date utilities: import only what you need
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'

// Utility functions: direct from source
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'

// Type-only imports (removed at compile time, no bundle impact)
import type { ButtonProps } from '@/components/button'
import type { User } from '@/types/user'

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const debouncedSearch = debounce(onSearch, 300)

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  )
}

export function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <UserIcon className="h-8 w-8" />
      <span>{user.name}</span>
      <Button variant="primary">Edit Profile</Button>
    </div>
  )
}

export function Dashboard() {
  return (
    <Sidebar>
      <Button>
        <HomeIcon className="h-4 w-4" />
        Home
      </Button>
    </Sidebar>
  )
}

export function DateDisplay({ date }: { date: string }) {
  const parsed = parseISO(date)
  const formatted = format(parsed, 'MMMM d, yyyy')
  const tomorrow = addDays(parsed, 1)

  return (
    <div>
      <p>Today: {formatted}</p>
      <p>Tomorrow: {format(tomorrow, 'MMMM d, yyyy')}</p>
    </div>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-lg border bg-white p-4 shadow-sm', className)}>
      {children}
    </div>
  )
}