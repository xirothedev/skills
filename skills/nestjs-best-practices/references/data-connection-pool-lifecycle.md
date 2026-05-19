---
title: Reuse PrismaClient and Respect Connection Pools
impact: CRITICAL
impactDescription: Prevents connection storms and pool exhaustion in NestJS runtimes
tags: prisma-client, connection-pool, lifecycle, nestjs, runtime
dataset: data/connection-pool-lifecycle
---

## Reuse PrismaClient and Respect Connection Pools

Creating a new Prisma Client per request creates avoidable pools and can exhaust the database. In NestJS, provide one app-scoped Prisma service and connect/disconnect through lifecycle hooks when needed.

**Incorrect (new client per request):**

```typescript
@Get()
async findAll() {
  const prisma = new PrismaClient();
  return prisma.user.findMany();
}
```

**Correct (singleton provider):**

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

Dataset: `dataset/data/connection-pool-lifecycle`

Reference:
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
- https://docs.nestjs.com/fundamentals/lifecycle-events
