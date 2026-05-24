// INCORRECT: Metadata reads uncached dynamic data.
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return { title: product?.name ?? "Product" };
}
