/**
 * Correct patterns for Next.js fetch caching strategies
 * Each function demonstrates a specific caching approach with proper TypeScript types
 */

// ============================================================================
// USER-SPECIFIC DATA: cache: 'no-store'
// User profiles must never be stale — always fetch fresh data
// ============================================================================

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}`, {
    cache: 'no-store', // Real-time, user-specific data
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json();
}

// ============================================================================
// RARELY-CHANGING CONTENT: next: { revalidate: N }
// Site settings change infrequently — cache reduces database load
// ============================================================================

interface SiteSettings {
  siteName: string;
  maintenanceMode: boolean;
  features: {
    notifications: boolean;
    analytics: boolean;
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch settings: ${res.status}`);
  }

  return res.json();
}

// ============================================================================
// SEMI-STATIC CONTENT: revalidate with longer duration
// Blog posts rarely change after publication
// ============================================================================

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  author: { name: string };
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`/api/posts/${slug}`, {
    next: { revalidate: 86400 }, // Revalidate every 24 hours
  });

  if (!res.ok) {
    throw new Error(`Post not found: ${slug}`);
  }

  return res.json();
}

// ============================================================================
// REACT.CACHE(): Cross-request deduplication
// Prevents duplicate database queries when multiple components need same data
// ============================================================================

import { cache } from 'react';
import { db } from '@/lib/db';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// This function is deduplicated within the same request
// If called multiple times with same id, only one DB query executes
export const getPost = cache(async (id: string): Promise<Post | null> => {
  return db.post.findUnique({
    where: { id },
  });
});

// ============================================================================
// ROUTE-LEVEL REVALIDATION: export const revalidate
// Applies to all fetch calls in this route segment
// ============================================================================

// In a page.tsx or layout.tsx:
// export const revalidate = 3600; // All fetches revalidate every hour

// Example page component using route-level revalidation
export const revalidate = 1800; // 30 minutes

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  // Inherits route-level revalidate: 1800 seconds
  return res.json();
}

// ============================================================================
// TAG-BASED REVALIDATION: On-demand cache invalidation
// Combine with revalidateTag for fine-grained control
// ============================================================================

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch('/api/products/featured', {
    next: {
      revalidate: 3600,
      tags: ['products', 'featured'] // Can be invalidated by tag
    },
  });

  return res.json();
}

// In a Server Action or API route:
// import { revalidateTag } from 'next/cache';
// await revalidateTag('products'); // Invalidates all fetches with 'products' tag

// ============================================================================
// TYPE-SAFE FETCH WRAPPER: Encapsulate common patterns
// ============================================================================

type CacheStrategy =
  | { cache: 'no-store' }
  | { next: { revalidate: number; tags?: string[] } };

interface FetchOptions<T> {
  url: string;
  cache: CacheStrategy;
  validate?: (data: unknown) => T; // Runtime type validation
}

export async function safeFetch<T>({
  url,
  cache,
  validate,
}: FetchOptions<T>): Promise<T> {
  const res = await fetch(url, cache);

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (validate) {
    return validate(data);
  }

  return data as T;
}