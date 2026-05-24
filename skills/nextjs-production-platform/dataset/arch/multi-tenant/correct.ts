// CORRECT: Resolve canonical tenant identity from trusted request host.
import { headers } from "next/headers";

export async function getProducts() {
  const host = (await headers()).get("host");
  const tenant = await resolveTenantFromHost(host);
  return db.product.findMany({ where: { tenantId: tenant.id } });
}
