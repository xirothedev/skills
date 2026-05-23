// app/page.tsx — App Router Server Component
import { getFeaturedPosts } from '@/lib/posts'
import { FeaturedPost } from './featured-post'

export default async function HomePage() {
  const posts = await getFeaturedPosts()
  return (
    <main>
      <h1>Welcome</h1>
      <FeaturedPost posts={posts} />
    </main>
  )
}
