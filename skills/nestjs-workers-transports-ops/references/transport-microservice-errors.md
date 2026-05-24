---
title: Use Transport-aware Exceptions in Message Handlers
impact: CRITICAL
impactDescription: Prevents HTTP-only exceptions from producing broken RPC error behavior
tags: microservices, rpc-exception, message-pattern, errors
dataset: transport/microservice-errors
---

## Use Transport-aware Exceptions in Message Handlers

NestJS microservice handlers are not HTTP controllers. Use `RpcException` or transport-specific error mapping instead of throwing HTTP exceptions from message handlers and guards.

**Incorrect (HTTP exception in RPC handler):**

```typescript
@MessagePattern({ cmd: "sum" })
sum(data: number[]) {
  throw new BadRequestException("Invalid payload");
}
```

**Correct (RPC exception):**

```typescript
@MessagePattern({ cmd: "sum" })
sum(data: number[]) {
  throw new RpcException({ code: "INVALID_PAYLOAD" });
}
```

## Source References

- https://docs.nestjs.com/microservices/basics
- https://docs.nestjs.com/microservices/exception-filters
