// INCORRECT: The public Route Handler trusts payload shape and leaks service output.
import { createInvoice } from "@/lib/invoices";

export async function POST(request: Request) {
  const body = await request.json();
  const invoice = await createInvoice(body);

  return Response.json(invoice);
}
