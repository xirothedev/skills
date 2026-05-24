// CORRECT: Server Component calls the backend client directly.
import { api } from "@/generated/api-client";

export default async function ProductsPage() {
  const products = await api.products.list();
  return <Products products={products} />;
}
