// CORRECT: Cache the stable component directly.
import { cacheLife } from "next/cache";

async function ProductsContent() {
  "use cache";
  cacheLife("minutes");
  const products = await getProducts();
  return <Products products={products} />;
}

export default function ProductsPage() {
  return <ProductsContent />;
}
