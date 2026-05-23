/**
 * INCORRECT font loading patterns - DO NOT USE
 *
 * These anti-patterns cause performance issues, layout shift, and poor UX.
 * Each example includes an explanation of why it's problematic.
 */

// ============================================
// ANTI-PATTERN: External Google Fonts Link
// ============================================

import type { ReactNode } from 'react'

/**
 * PROBLEM: External network request to Google Fonts
 *
 * Issues:
 * 1. DNS resolution + TLS handshake + connection overhead (~100-300ms)
 * 2. Privacy concerns (GDPR) - requests to external domain
 * 3. No self-hosting benefits
 * 4. Font CSS not inlined at build time
 * 5. Cannot preload font files efficiently
 * 6. Blocking render while fetching external resource
 *
 * Performance impact: Adds 100-500ms to page load
 */

export default function BadLayoutExternalLink({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: External font request */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Also problematic: Multiple requests for same font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
          rel="stylesheet"
        />
        {/* Another separate request for different font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: CSS @import for Fonts
// ============================================

/**
 * PROBLEM: Render-blocking @import in CSS
 *
 * Issues:
 * 1. @import blocks CSS parsing until font CSS is fetched
 * 2. Causes FOIT (Flash of Invisible Text)
 * 3. Serial download chain (CSS -> @import -> font file)
 * 4. No font-display control in @import URL
 * 5. Cannot be preloaded or prefetched
 *
 * Performance impact: Blocks rendering for 200-800ms
 */

// styles/globals.css - DO NOT DO THIS
/*
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
}
*/

// ============================================
// ANTI-PATTERN: Missing font-display: swap
// ============================================

/**
 * PROBLEM: Default font-display behavior (block/swap/auto)
 *
 * Without explicit display: swap:
 * 1. Browser may block text rendering for up to 3 seconds (FOIT)
 * 2. Users see invisible text while font loads
 * 3. Poor Cumulative Layout Shift score
 * 4. Negative impact on Core Web Vitals
 *
 * Performance impact: Text invisible for 0-3000ms
 */

export default function BadLayoutNoDisplaySwap({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: No font-display specified, browser defaults to block */}
        <style>{`
          @font-face {
            font-family: 'CustomFont';
            src: url('/fonts/CustomFont.woff2') format('woff2');
            /* MISSING: font-display: swap; */
          }
        `}</style>
      </head>
      <body style={{ fontFamily: 'CustomFont, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: Loading All Font Weights
// ============================================

/**
 * PROBLEM: Loading unnecessary font weights
 *
 * Issues:
 * 1. Each weight is a separate font file (~20-30KB each)
 * 2. Loading 9 weights when only 2-3 are used
 * 3. Wasted bandwidth and slower load times
 * 4. User's browser downloads files they never need
 *
 * Performance impact: 150-200KB of unnecessary font data
 */

export default function BadLayoutAllWeights({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: Loading ALL weights when only 400 and 700 are needed */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* This downloads 9 font files (~200KB total) instead of 2 (~50KB) */}
      </head>
      <body>{children}</body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: Inline Base64 Fonts (Large Files)
// ============================================

/**
 * PROBLEM: Inlining large font files as base64 in CSS
 *
 * Issues:
 * 1. Base64 encoding increases file size by ~33%
 * 2. Blocks CSS parsing during download
 * 3. Cannot be cached separately from CSS
 * 4. Increases initial bundle size dramatically
 * 5. Delays First Contentful Paint
 *
 * Performance impact: Adds 50-200KB to initial CSS bundle
 */

export default function BadLayoutInlineBase64({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: Large base64-encoded font inlined in CSS */}
        <style>{`
          @font-face {
            font-family: 'BigFont';
            src: url(data:font/woff2;base64,d09GMgABAAAAAA...) format('woff2');
            /* Base64 string can be 100KB+ for full font */
          }
          body {
            font-family: 'BigFont', sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: Multiple Font Families
// ============================================

/**
 * PROBLEM: Loading too many different font families
 *
 * Issues:
 * 1. Each font family adds ~50-100KB
 * 2. Visual inconsistency with too many typefaces
 * 3. Poor brand identity
 * 4. Wasted user bandwidth
 *
 * Performance impact: 200-500KB+ for fonts alone
 */

export default function BadLayoutManyFonts({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: Loading 5+ different font families */}
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
        {/* 6 font families = ~300KB+ of font data */}
      </head>
      <body>{children}</body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: No Preload for Critical Fonts
// ============================================

/**
 * PROBLEM: Critical fonts not preloaded
 *
 * Issues:
 * 1. Font loading deferred until CSS parser finds @font-face
 * 2. Font file discovered late in critical rendering path
 * 3. Users see fallback font longer
 * 4. Potential layout shift when font swaps
 *
 * While next/font handles this automatically, manual font loading
 * requires explicit preload links.
 */

export default function BadLayoutNoPreload({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* BAD: No preload for critical font */}
        <style>{`
          @font-face {
            font-family: 'CriticalFont';
            src: url('/fonts/CriticalFont.woff2') format('woff2');
            font-display: swap;
          }
        `}</style>
        {/* MISSING: <link rel="preload" href="/fonts/CriticalFont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> */}
      </head>
      <body style={{ fontFamily: 'CriticalFont, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

// ============================================
// ANTI-PATTERN: Using TTF/OTF Instead of WOFF2
// ============================================

/**
 * PROBLEM: Using uncompressed font formats
 *
 * Issues:
 * 1. TTF/OTF files are 2-3x larger than WOFF2
 * 2. No compression applied
 * 3. Unnecessary bandwidth consumption
 * 4. Slower download times
 *
 * File size comparison for same font:
 * - TTF: 150KB
 * - WOFF: 90KB
 * - WOFF2: 60KB (best choice)
 */

export default function BadLayoutUncompressedFormats({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @font-face {
            font-family: 'UncompressedFont';
            /* BAD: Using TTF instead of WOFF2 */
            src: url('/fonts/Font.ttf') format('truetype');
            /* Also bad but slightly better */
            /* src: url('/fonts/Font.woff') format('woff'); */
            font-display: swap;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: 'UncompressedFont, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

// ============================================
// CORRECT APPROACH (for reference)
// ============================================

/**
 * Use next/font instead of all the anti-patterns above:
 *
 * import { Inter } from 'next/font/google'
 *
 * const inter = Inter({
 *   subsets: ['latin'],
 *   display: 'swap',
 *   variable: '--font-inter',
 *   weight: ['400', '700'], // Only weights you use
 * })
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html lang="en" className={inter.variable}>
 *       <body>{children}</body>
 *     </html>
 *   )
 * }
 *
 * Benefits:
 * - Self-hosted (no external requests)
 * - Automatic preload/preconnect
 * - WOFF2 format only
 * - Subset optimization
 * - Zero layout shift
 * - CSS variable integration
 */