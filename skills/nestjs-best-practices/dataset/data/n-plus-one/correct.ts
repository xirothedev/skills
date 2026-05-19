@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listUsersWithPosts() {
    return this.prisma.user.findMany({
      relationLoadStrategy: "join",
      include: {
        posts: {
          select: { id: true, title: true, publishedAt: true },
        },
      },
    });
  }
}
