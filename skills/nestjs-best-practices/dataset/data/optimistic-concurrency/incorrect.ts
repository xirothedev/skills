export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async withdraw(id: string, amount: number) {
    const account = await this.prisma.account.findUniqueOrThrow({ where: { id } });

    return this.prisma.account.update({
      where: { id },
      data: { balance: account.balance - amount },
    });
  }
}
