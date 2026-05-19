import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args("input") input: CreateUserInput) {
    return this.usersService.create(input);
  }
}
