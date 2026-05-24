// INCORRECT: Tenant id comes from user-controlled query params.
export async function getProducts(searchParams: { tenant?: string }) {
  return db.product.findMany({ where: { tenantId: searchParams.tenant } });
}
