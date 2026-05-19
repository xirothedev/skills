@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async markPaid(id: string) {
    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: { status: "PROCESSING" },
    });
    await this.gateway.charge(invoice.total);
    return this.prisma.invoice.update({ where: { id }, data: { status: "PAID" } });
  }
}
