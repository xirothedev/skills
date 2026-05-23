// Correct: Serializable props passed from Server to Client Component
// app/dashboard/page.tsx (Server Component)
import { getUser } from '@/lib/auth'
import { ClientDashboard } from './client-dashboard'

export default async function DashboardPage() {
  const user = await getUser()

  // Pass serializable data only: strings, numbers, objects, arrays
  return (
    <ClientDashboard
      userId={user.id}
      name={user.name}
      email={user.email}
      preferences={user.preferences}
    />
  )
}

// ---
// app/dashboard/client-dashboard.tsx (Client Component)
'use client'

import { useState } from 'react'

interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
  language: string
}

interface ClientDashboardProps {
  userId: string
  name: string
  email: string
  preferences: UserPreferences
}

export function ClientDashboard({ userId, name, email, preferences }: ClientDashboardProps) {
  const [theme, setTheme] = useState(preferences.theme)

  // Define event handlers INSIDE the Client Component
  const logAction = (action: string) => {
    console.log(`User ${userId} performed: ${action}`)
    // Can send to analytics, logging service, etc.
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    logAction(`theme:${newTheme}`)
  }

  return (
    <div className={theme}>
      <header>
        <h1>Welcome, {name}</h1>
        <p>{email}</p>
      </header>
      <button onClick={handleThemeToggle}>Toggle Theme</button>
      <button onClick={() => logAction('refresh')}>Refresh</button>
    </div>
  )
}

// ---
// Alternative: Server Component passes callback ID, Client fetches handler
// app/items/page.tsx (Server Component)
import { ItemList } from './item-list'

export default async function ItemsPage() {
  // Pass serializable filter criteria, not filter function
  return <ItemList initialFilter={{ status: 'active', sortBy: 'date' }} />
}

// ---
// app/items/item-list.tsx (Client Component)
'use client'

interface FilterCriteria {
  status: 'active' | 'archived' | 'all'
  sortBy: 'date' | 'name' | 'priority'
}

export function ItemList({ initialFilter }: { initialFilter: FilterCriteria }) {
  const [filter, setFilter] = useState(initialFilter)
  const [items, setItems] = useState<Item[]>([])

  // Filter function defined client-side
  const applyFilter = (newFilter: FilterCriteria) => {
    setFilter(newFilter)
    // Fetch or refetch data based on new filter
  }

  return (
    <div>
      <FilterControls filter={filter} onChange={applyFilter} />
      <ItemsGrid items={items} />
    </div>
  )
}