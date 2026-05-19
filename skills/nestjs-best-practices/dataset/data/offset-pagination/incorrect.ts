@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  list(page: number, pageSize: number) {
    return this.prisma.invoice.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  }
}
