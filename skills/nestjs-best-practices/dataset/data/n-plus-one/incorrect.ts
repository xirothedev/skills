@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsersWithPosts() {
    const users = await this.prisma.user.findMany();
    return Promise.all(
      users.map(async (user) => ({
        ...user,
        posts: await this.prisma.post.findMany({ where: { authorId: user.id } }),
      })),
    );
  }
}
