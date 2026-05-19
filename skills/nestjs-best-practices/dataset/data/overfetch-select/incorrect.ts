@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getPublicProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, sessions: true },
    });
  }
}
