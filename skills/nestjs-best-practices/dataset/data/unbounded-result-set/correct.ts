export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  list(tenantId: string, query: { limit?: number }) {
    const take = Math.min(query.limit ?? 50, 100);

    return this.prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    });
  }
}
