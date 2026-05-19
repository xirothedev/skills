@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  list(cursor: string | undefined, pageSize: number) {
    return this.prisma.invoice.findMany({
      take: pageSize,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }
}
