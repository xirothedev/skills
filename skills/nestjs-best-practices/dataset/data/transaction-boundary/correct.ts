@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(input: CreateOrderInput) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: input.order });
      await tx.payment.create({ data: { orderId: order.id, amount: input.amount } });
      await tx.auditLog.create({ data: { orderId: order.id, action: "created" } });
      return order;
    });
  }
}
