// app/dashboard/page.tsx — Server Component with SSR-like freshness
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
  }
  stats: {
    views: number
    clicks: number
    conversions: number
  }
  recentActivity: Array<{
    id: string
    action: string
    timestamp: string
  }>
}

// Fetch with no-store for per-request data (SSR equivalent)
async function getDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies()
  const headersList = await headers()

  const sessionToken = cookieStore.get('session')?.value
  const requestId = headersList.get('x-request-id')

  if (!sessionToken) {
    redirect('/login')
  }

  const res = await fetch('https://api.example.com/dashboard', {
    cache: 'no-store', // Important: fetch fresh data on every request
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'X-Request-ID': requestId || '',
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      redirect('/login')
    }
    throw new Error('Failed to fetch dashboard data')
  }

  return res.json()
}

export default async function DashboardPage() {
  // This runs on every request (SSR-like behavior)
  const data = await getDashboardData()

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {data.user.name}</h1>
        <p>{data.user.email}</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Views</h3>
          <p className="stat-value">{data.stats.views.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Clicks</h3>
          <p className="stat-value">{data.stats.clicks.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Conversions</h3>
          <p className="stat-value">{data.stats.conversions.toLocaleString()}</p>
        </div>
      </section>

      <section className="activity-section">
        <h2>Recent Activity</h2>
        <ul className="activity-list">
          {data.recentActivity.map((activity) => (
            <li key={activity.id} className="activity-item">
              <span className="action">{activity.action}</span>
              <time className="timestamp">
                {new Date(activity.timestamp).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

// --- Separate file: app/admin/users/page.tsx (with revalidation) ---

import { revalidatePath } from 'next/cache'

interface User {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://api.example.com/admin/users', {
    cache: 'no-store', // Always fresh for admin panel
  })

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  return res.json()
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <main className="admin-users">
      <h1>User Management</h1>
      <p className="subtitle">Real-time data — fetched on every request</p>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.lastActive).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

// --- Separate file: app/cart/page.tsx (user-specific SSR) ---

import { cookies } from 'next/headers'
import Link from 'next/link'

interface CartItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
}

interface Cart {
  items: CartItem[]
  total: number
}

async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cart_id')?.value

  if (!cartId) {
    return null
  }

  const res = await fetch(`https://api.example.com/cart/${cartId}`, {
    cache: 'no-store', // Cart data must be fresh
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function CartPage() {
  const cart = await getCart()

  if (!cart || cart.items.length === 0) {
    return (
      <main className="cart-empty">
        <h1>Your Cart</h1>
        <p>Your cart is empty</p>
        <Link href="/products">Continue Shopping</Link>
      </main>
    )
  }

  return (
    <main className="cart">
      <h1>Your Cart</h1>
      <ul className="cart-items">
        {cart.items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="name">{item.name}</span>
            <span className="quantity">Qty: {item.quantity}</span>
            <span className="price">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <strong>Total: ${cart.total.toFixed(2)}</strong>
      </div>
      <Link href="/checkout" className="checkout-link">
        Proceed to Checkout
      </Link>
    </main>
  )
}