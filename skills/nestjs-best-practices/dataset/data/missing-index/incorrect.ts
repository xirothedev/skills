// schema.prisma
model Invoice {
  id        String   @id @default(cuid())
  tenantId  String
  status    String
  createdAt DateTime @default(now())
}

// invoices.service.ts
return this.prisma.invoice.findMany({
  where: { tenantId, status: "OPEN" },
  orderBy: { createdAt: "desc" },
  take: 50,
});
