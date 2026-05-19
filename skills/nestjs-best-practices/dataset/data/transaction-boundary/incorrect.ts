@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(input: CreateOrderInput) {
    const order = await this.prisma.order.create({ data: input.order });
    await this.prisma.payment.create({ data: { orderId: order.id, amount: input.amount } });
    await this.prisma.auditLog.create({ data: { orderId: order.id, action: "created" } });
    return order;
  }
}
