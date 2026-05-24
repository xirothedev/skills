// INCORRECT: Old route segment flags hide the actual cache boundary.
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();
  return <Products products={products} />;
}
