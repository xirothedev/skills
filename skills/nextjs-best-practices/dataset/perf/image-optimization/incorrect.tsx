// Incorrect: Raw <img> tags without optimization
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      {/* WRONG: No optimization, no dimensions, causes layout shift */}
      <img src="/hero-banner.webp" alt="Welcome to our platform" />

      <section className="max-w-4xl mx-auto p-8">
        <h1>Welcome</h1>
        <p>...</p>
      </section>

      {/* WRONG: Full-size image served even on mobile */}
      <img
        src="/features.png"
        alt="Platform features diagram"
        width="800"
        height="400"
      />

      {/* WRONG: External image — no security check, no optimization */}
      <img
        src="https://cdn.example.com/avatars/user-123.jpg"
        alt="User avatar"
        width="48"
        height="48"
      />
    </main>
  )
}

// ---
// app/products/[id]/page.tsx (no responsive sizing)
export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square">
      {/* WRONG: No sizes attribute — mobile downloads desktop resolution */}
      <img src={src} alt={alt} className="object-cover rounded-lg" />
    </div>
  )
}

// ---
// next.config.js (no image optimization config)
module.exports = {
  // No images config — external images won't be optimized
  // No remotePatterns — no security whitelist
  // Default format: original (no WebP/AVIF conversion)
}

// Problems:
// 1. Layout shift — browser doesn't know image dimensions until loaded
// 2. No format conversion — full-size PNG/JPEG served instead of WebP/AVIF
// 3. No lazy loading — all images download on page load, even below-fold
// 4. No responsive sizing — mobile downloads same large image as desktop
// 5. No security for external images — any URL can be proxied
// 6. No blur placeholder — page looks broken while images load
// 7. LCP image not prioritized — hero loads after other resources
