@Controller("users")
export class UsersController {
  @Get()
  async findAll() {
    const prisma = new PrismaClient();
    return prisma.user.findMany();
  }
}
