@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getPublicProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        profile: {
          select: { displayName: true, avatarUrl: true },
        },
      },
    });
  }
}
