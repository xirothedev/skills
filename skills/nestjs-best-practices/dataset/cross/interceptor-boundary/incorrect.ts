import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return { data, generatedAt: new Date().toISOString() };
  }
}
