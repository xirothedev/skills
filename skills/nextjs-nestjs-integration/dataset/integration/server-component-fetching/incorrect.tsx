// INCORRECT: Server Component self-fetches the same Next.js app.
export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`);
  const products = await res.json();
  return <Products products={products} />;
}
