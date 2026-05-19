export const schema = `
model User {
  id       String    @id @default(cuid())
  email    String    @unique
  invoices Invoice[]
}

model Invoice {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Restrict)
}
`;

export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { email: string }) {
    try {
      return await this.prisma.user.create({ data: input });
    } catch (error) {
      if (isUniqueConstraintError(error)) throw new ConflictException("Email already exists");
      throw error;
    }
  }
}
