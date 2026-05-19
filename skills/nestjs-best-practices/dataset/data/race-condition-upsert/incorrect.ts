export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(input: { email: string; name: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) return existing;

    return this.prisma.user.create({ data: input });
  }
}
