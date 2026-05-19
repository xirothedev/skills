export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOrCreate(input: { email: string; name: string }) {
    return this.prisma.user.upsert({
      where: { email: input.email },
      update: { name: input.name },
      create: input,
    });
  }
}
