// CORRECT: Validate the public request contract and return a minimal response.
import { createInvoiceSchema, createInvoice } from "@/lib/invoices";

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return Response.json({ error: "Unsupported media type" }, { status: 415 });
  }

  const parsed = createInvoiceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const invoice = await createInvoice(parsed.data);
  return Response.json({ id: invoice.id }, { status: 201 });
}
