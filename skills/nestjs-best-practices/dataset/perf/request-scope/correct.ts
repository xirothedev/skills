import { Injectable } from "@nestjs/common";

type RequestContext = {
  tenantId: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepo) {}

  findAll(context: RequestContext) {
    return this.repo.findManyForTenant(context.tenantId);
  }
}
