import { Controller, Get, Param } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("users")
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
