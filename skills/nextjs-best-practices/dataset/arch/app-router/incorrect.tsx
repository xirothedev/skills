// pages/index.tsx — Pages Router (deprecated for new projects)
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://api.example.com/posts?featured=true')
  const posts = await res.json()
  return { props: { posts } }
}

export default function HomePage({ posts }: { posts: any[] }) {
  return (
    <main>
      <h1>Welcome</h1>
      {posts.map(p => <div key={p.id}>{p.title}</div>)}
    </main>
  )
}
