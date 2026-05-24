// CORRECT: Metadata uses a cached, minimal data source.
import { cacheLife } from "next/cache";

async function getProductMetadata(id: string) {
  "use cache";
  cacheLife("hours");
  return db.product.findUnique({
    where: { id },
    select: { name: true },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductMetadata(params.id);
  return { title: product?.name ?? "Product" };
}
