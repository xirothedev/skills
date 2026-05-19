export const schema = `
model User {
  id    String @id @default(cuid())
  email String
}

model Invoice {
  id     String @id @default(cuid())
  userId String
}
`;

export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { email: string }) {
    const existing = await this.prisma.user.findFirst({ where: { email: input.email } });
    if (existing) throw new ConflictException("Email already exists");
    return this.prisma.user.create({ data: input });
  }
}
