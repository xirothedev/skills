export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async withdraw(id: string, amount: number) {
    const account = await this.prisma.account.findUniqueOrThrow({ where: { id } });

    const result = await this.prisma.account.updateMany({
      where: { id, version: account.version },
      data: {
        balance: { decrement: amount },
        version: { increment: 1 },
      },
    });

    if (result.count !== 1) throw new ConflictException("Account changed; retry");
  }
}
