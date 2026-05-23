/**
 * Correct font optimization patterns using next/font
 *
 * These examples demonstrate proper usage of next/font/google and next/font/local
 * for optimal font loading performance and zero layout shift.
 */

// ============================================
// Google Font with next/font/google
// ============================================

import { Inter, Roboto_Mono, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

// Standard configuration with subsets and CSS variable
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '700'], // Only include weights you use
})

// Monospace font for code blocks
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
})

// Display font with extended latin support
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
})

// ============================================
// Local Font with next/font/local
// ============================================

import localFont from 'next/font/local'

// Single font file configuration
const brandFont = localFont({
  src: './fonts/BrandFont-Regular.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-brand',
})

// Multiple font files for different weights
const headingFont = localFont({
  src: [
    {
      path: './fonts/Heading-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Heading-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Heading-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Heading-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-heading',
})

// Variable font with weight range
const variableFont = localFont({
  src: './fonts/VariableFont.woff2',
  weight: '100 900', // Variable font supports full weight range
  style: 'normal',
  display: 'swap',
  variable: '--font-variable',
})

// ============================================
// Root Layout Integration
// ============================================

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}

// ============================================
// Tailwind CSS Configuration
// ============================================

// tailwind.config.ts
// import type { Config } from 'tailwindcss'
//
// const config: Config = {
//   content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
//         mono: ['var(--font-mono)', 'consolas', 'monospace'],
//         display: ['var(--font-display)', 'serif'],
//         heading: ['var(--font-heading)', 'sans-serif'],
//         brand: ['var(--font-brand)', 'cursive'],
//       },
//     },
//   },
//   plugins: [],
// }
//
// export default config

// ============================================
// Usage in Components
// ============================================

function TypographyExample() {
  return (
    <article className="space-y-4">
      {/* Uses Inter via font-sans */}
      <p className="font-sans text-base text-gray-900">
        Body text uses the primary sans-serif font.
      </p>

      {/* Uses Roboto Mono via font-mono */}
      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
        const example = &quot;monospace font&quot;
      </code>

      {/* Uses Playfair Display via font-display */}
      <h1 className="font-display text-4xl font-bold text-gray-900">
        Elegant Display Heading
      </h1>

      {/* Uses heading font via font-heading */}
      <h2 className="font-heading text-2xl font-medium text-gray-800">
        Section Heading
      </h2>

      {/* Direct CSS variable usage */}
      <span style={{ fontFamily: 'var(--font-brand)' }}>
        Brand-specific text
      </span>
    </article>
  )
}

// ============================================
// App Router Layout with Multiple Fonts
// ============================================

function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${headingFont.variable} ${brandFont.variable}`}>
      {/* Fonts available to all child components */}
      <header className="font-heading text-xl">
        Marketing Header
      </header>
      {children}
    </div>
  )
}

// ============================================
// Page-Specific Font Loading
// ============================================

// Only load heavy fonts on pages that need them
const decorativeFont = localFont({
  src: './fonts/Decorative.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-decorative',
})

function LandingPage() {
  return (
    <div className={decorativeFont.variable}>
      <h1 className="font-sans text-5xl">
        {/* Decorative font available via CSS variable */}
        <span style={{ fontFamily: 'var(--font-decorative)' }}>
          Welcome
        </span>
      </h1>
    </div>
  )
}