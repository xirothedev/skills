// Correct: Server Component fetches data, small Client Component handles filter
// app/products/page.tsx (Server Component — zero client JS for data fetching)

import { ProductList } from './product-list'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList initialProducts={products} />
}

// ---
// app/products/product-list.tsx (Client Component — only filter interactivity)
'use client'

import { useState, useMemo } from 'react'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase())
      const matchesCategory = !category || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [initialProducts, filter, category])

  return (
    <div>
      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={category ?? ''} onChange={(e) => setCategory(e.target.value || null)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>
      <ul>
        {filtered.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---
// app/layout/page.tsx (Server Component passing Server child to Client Modal)
import { Modal } from '@/components/modal'
import { ExpensiveServerComponent } from './expensive-server-component'

export default function LayoutPage() {
  return (
    <main>
      <h1>Welcome</h1>
      <Modal trigger={<button>Open Settings</button>}>
        {/* This entire component runs on the server — NOT bundled in client */}
        <ExpensiveServerComponent />
      </Modal>
    </main>
  )
}

// ---
// components/modal.tsx (Client Component — only modal state)
'use client'

import { useState, type ReactNode } from 'react'

export function Modal({
  trigger,
  children,
}: {
  trigger: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)}>Close</button>
            {children}
          </div>
        </div>
      )}
    </>
  )
}