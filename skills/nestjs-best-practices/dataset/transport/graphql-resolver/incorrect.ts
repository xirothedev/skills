import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation(() => User)
  createUser(@Args("input") input: CreateUserInput) {
    return this.prisma.user.create({ data: input });
  }
}
