import { CallHandler, Controller, ExecutionContext, Get, Injectable, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ data, generatedAt: new Date().toISOString() })));
  }
}

@UseInterceptors(ResponseEnvelopeInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
