import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEventHandler } from 'react'

/**
 * Standard navigation with automatic prefetch.
 * Next.js prefetches when the link enters the viewport.
 */
export function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/products">Products</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  )
}

/**
 * Disabling prefetch for rare or protected routes.
 * Prevents unnecessary bandwidth usage for destinations users rarely visit.
 */
export function RareNavigation() {
  return (
    <nav>
      <Link href="/admin" prefetch={false}>
        Admin Panel
      </Link>
      <Link href="/settings/account" prefetch={false}>
        Account Settings
      </Link>
      <Link href="/billing/invoices" prefetch={false}>
        Billing History
      </Link>
    </nav>
  )
}

/**
 * Programmatic prefetching ahead of user action.
 * Useful for prefetching based on hover or other signals before viewport entry.
 */
export function PrefetchOnHover({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter()

  const handleMouseEnter: MouseEventHandler<HTMLAnchorElement> = () => {
    router.prefetch(href)
  }

  return (
    <Link href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  )
}

/**
 * Prefetching multiple routes for a dashboard widget.
 * Anticipates user navigation patterns.
 */
export function DashboardWidget() {
  const router = useRouter()

  const prefetchReports = () => {
    router.prefetch('/reports/monthly')
    router.prefetch('/reports/annual')
  }

  return (
    <div onFocus={prefetchReports} tabIndex={0}>
      <h2>Quick Access</h2>
      <Link href="/reports/monthly">Monthly Report</Link>
      <Link href="/reports/annual">Annual Report</Link>
    </div>
  )
}