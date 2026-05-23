/**
 * INCORRECT patterns for Next.js fetch caching
 * Each example demonstrates a common anti-pattern with explanation of the problem
 */

// ============================================================================
// PROBLEM 1: Default caching on user-specific data
// Fetch without cache options caches indefinitely — user profiles become stale
// ============================================================================

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

// BAD: Default fetch caches forever in production
// User changes their name, but stale data persists indefinitely
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}`);
  // Problem: No cache option = cached indefinitely
  // One user's profile could be served to all users until rebuild
  return res.json();
}

// ============================================================================
// PROBLEM 2: No cache strategy on high-traffic endpoints
// Every request hits the database/api — unnecessary load
// ============================================================================

interface SiteConfig {
  siteName: string;
  version: string;
  lastUpdated: string;
}

// BAD: Site config rarely changes but fetches on every request
// High traffic = massive unnecessary load on database
export async function getSiteConfig(): Promise<SiteConfig> {
  const res = await fetch('/api/config');
  // Problem: No caching strategy for static-ish data
  // Database hit on every page view for data that changes monthly
  return res.json();
}

// ============================================================================
// PROBLEM 3: Conflicting cache strategies
// cache: 'no-store' overrides revalidate — revalidate is ignored
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
}

// BAD: Mixed strategies, no-store wins
export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products', {
    cache: 'no-store', // This wins
    next: { revalidate: 3600 }, // This is ignored completely
  });
  // Problem: Developer expects 1-hour revalidation
  // Reality: No caching at all due to no-store
  return res.json();
}

// ============================================================================
// PROBLEM 4: Over-caching real-time data
// Stock prices, notifications, live scores — must be fresh
// ============================================================================

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  timestamp: string;
}

// BAD: Caching real-time stock data
export async function getStockPrice(symbol: string): Promise<StockPrice> {
  const res = await fetch(`/api/stocks/${symbol}`, {
    next: { revalidate: 300 }, // 5 minutes of stale stock prices
  });
  // Problem: Stock prices change every second
  // 5 minutes stale = completely useless financial data
  return res.json();
}

// ============================================================================
// PROBLEM 5: React.cache() misunderstanding
// Expecting cross-request persistence — only works within single request
// ============================================================================

import { cache } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}

// BAD: Expecting this to cache across different user requests
export const getUserPreferences = cache(async (userId: string): Promise<UserPreferences> => {
  return fetch(`/api/users/${userId}/preferences`).then(r => r.json());
});
// Problem: React.cache() only deduplicates WITHIN a single request
// It does NOT persist data across different requests/sessions
// Each new request triggers a fresh fetch

// ============================================================================
// PROBLEM 6: Forcing static on dynamic user data
// build-time cache for data that varies per user
// ============================================================================

interface DashboardStats {
  totalSales: number;
  activeUsers: number;
  revenue: number;
}

// BAD: Static cache on dynamic, user-specific dashboard
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const res = await fetch(`/api/dashboard/${userId}`, {
    next: { revalidate: false }, // Cached at build time
  });
  // Problem: Dashboard stats are unique per user
  // Build-time caching serves same stats to every user
  return res.json();
}

// ============================================================================
// PROBLEM 7: Inconsistent caching across related endpoints
// Same data type, different cache strategies = confusing behavior
// ============================================================================

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// BAD: Inconsistent cache strategies for same data type
export async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`/api/articles/${id}`, {
    cache: 'no-store', // Always fresh
  });
  return res.json();
}

export async function getArticles(): Promise<Article[]> {
  const res = await fetch('/api/articles', {
    next: { revalidate: 3600 }, // Cached for an hour
  });
  // Problem: List page shows stale articles
  // Detail page shows fresh article
  // User sees different content on list vs detail
  return res.json();
}

// ============================================================================
// PROBLEM 8: Missing error handling with cached responses
// Cached error responses persist until revalidation
// ============================================================================

// BAD: No error handling, errors get cached
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const res = await fetch('/api/features', {
    next: { revalidate: 600 }, // 10 minutes
  });
  // Problem: If endpoint returns 500 error, that error is cached for 10 minutes
  // Users see broken feature flags until cache expires
  return res.json();
}

// ============================================================================
// PROBLEM 9: Route-level revalidation overridden incorrectly
// Expecting route-level control but individual fetches override
// ============================================================================

// In page.tsx:
// export const revalidate = 3600; // Route-level: 1 hour

// BAD: Accidentally overriding route-level setting
export async function getPageData(): Promise<unknown> {
  const res = await fetch('/api/page-data', {
    cache: 'no-store', // Overrides route-level revalidate
  });
  // Problem: Route-level revalidate = 3600 is completely ignored
  // This fetch hits origin on every request despite route setting
  return res.json();
}