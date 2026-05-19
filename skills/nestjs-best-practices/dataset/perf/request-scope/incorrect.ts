import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(private readonly repo: UsersRepo) {}

  findAll() {
    return this.repo.findMany();
  }
}
