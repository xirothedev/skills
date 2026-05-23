// Correct: next/image with optimization, proper sizing, and priority for LCP
// app/page.tsx
import Image from 'next/image'

export default function HomePage() {
  return (
    <main>
      {/* LCP image — priority loads immediately, not lazy */}
      <Image
        src="/hero-banner.webp"
        alt="Welcome to our platform"
        width={1920}
        height={600}
        priority
        className="w-full h-auto"
      />

      <section className="max-w-4xl mx-auto p-8">
        <h1>Welcome</h1>
        <p>...</p>
      </section>

      {/* Below-fold image — lazy-loaded automatically */}
      <Image
        src="/features.png"
        alt="Platform features diagram"
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="w-full h-auto"
      />

      {/* External image with configured remotePatterns */}
      <Image
        src="https://cdn.example.com/avatars/user-123.jpg"
        alt="User avatar"
        width={48}
        height={48}
        className="rounded-full"
      />
    </main>
  )
}

// ---
// next.config.ts (external image configuration)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/avatars/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig

// ---
// app/products/[id]/page.tsx (responsive product image)
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="relative aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover rounded-lg"
        // No priority — product page has many images
      />
    </div>
  )
}

// Key points:
// 1. LCP image gets `priority` — no lazy loading delay
// 2. Below-fold images lazy-load automatically
// 3. `sizes` tells browser which resolution to request
// 4. `fill` + `object-cover` for responsive containers
// 5. External images require `remotePatterns` config
// 6. Auto-format conversion to WebP/AVIF — 30-50% smaller
