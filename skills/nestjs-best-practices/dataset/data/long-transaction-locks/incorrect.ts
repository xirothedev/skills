@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async markPaid(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.update({ where: { id }, data: { status: "PROCESSING" } });
      await this.gateway.charge(invoice.total);
      return tx.invoice.update({ where: { id }, data: { status: "PAID" } });
    });
  }
}
