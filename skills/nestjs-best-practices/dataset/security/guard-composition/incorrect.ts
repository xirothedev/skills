import { Controller, Get, Param, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  findOne(@Req() req: Request, @Param("id") id: string) {
    if (!req.user) throw new UnauthorizedException();
    if (req.user.role !== "admin") throw new UnauthorizedException();
    return this.usersService.findOne(id);
  }
}
