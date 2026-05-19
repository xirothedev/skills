import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController, OrdersController],
  providers: [PrismaService, UsersService, OrdersService],
})
export class AppModule {}
