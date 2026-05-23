// INCORRECT: Sync params access — broken in Next.js 15+

// app/products/[id]/page.tsx — WRONG: params is a Promise in Next.js 15
interface WrongPageProps {
  params: { id: string }  // Wrong: should be Promise<{ id: string }>
}

export default function ProductPage({ params }: WrongPageProps) {
  // This will throw: TypeError: Cannot read properties of undefined
  // because params is actually a Promise, not an object
  return <div>Product {params.id}</div>
}

// ---
// Another wrong pattern: accessing params without awaiting

interface AlsoWrongProps {
  params: Promise<{ id: string }>
}

export default function AlsoWrong({ params }: AlsoWrongProps) {
  // Missing async on function, can't await
  // Trying to access .id on a Promise will fail
  return <div>Product {params.id}</div>  // Property 'id' does not exist on Promise
}

// ---
// Route handlers with wrong params pattern

// app/api/users/[id]/route.ts — WRONG
export async function GET(
  request: Request,
  { params }: { params: { id: string } }  // Wrong: should be Promise
) {
  // This will throw in Next.js 15+
  return Response.json({ userId: params.id })
}

// ---
// generateMetadata with sync params access

// app/blog/[slug]/page.tsx — WRONG
import { Metadata } from 'next'

interface WrongMetadataProps {
  params: { slug: string }  // Wrong type
}

export async function generateMetadata({ params }: WrongMetadataProps): Promise<Metadata> {
  // params is actually a Promise, this will fail
  return { title: `Blog: ${params.slug}` }
}

// ---
// searchParams also need to be awaited

interface WrongSearchParamsProps {
  params: Promise<{ id: string }>
  searchParams: { filter: string }  // Wrong: should be Promise
}

export default function PageWithSearchParams({
  params,
  searchParams
}: WrongSearchParamsProps) {
  // searchParams is a Promise in Next.js 15+
  return <div>Filter: {searchParams.filter}</div>  // Will fail
}

// ---
// Why these patterns fail:
// 1. Next.js 15 makes params/searchParams Promises for async rendering
// 2. Accessing .id on a Promise returns undefined (not the resolved value)
// 3. TypeScript may not catch this if types are wrong
// 4. Error happens at runtime: "Cannot read properties of undefined"
// 5. Fix: add async to function, await params, update types

// ---
// Runtime error you'll see:
// TypeError: Cannot read properties of undefined (reading 'id')
//   at ProductPage (app/products/[id]/page.tsx:12:21)