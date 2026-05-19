# Section Definitions

Rules are grouped by filename prefix. Load a section only when it matches the task.

## 1. Architecture & Dependency Injection (arch)
**Impact:** CRITICAL  
Feature modules, provider boundaries, DI tokens, dynamic modules, scope choices, and circular dependency avoidance.

## 2. API Contracts & Validation (api)
**Impact:** CRITICAL  
Controllers, DTOs, validation pipes, serialization, versioning, and OpenAPI contracts.

## 3. Security & Authorization (security)
**Impact:** CRITICAL  
Guards, authentication, authorization, RBAC/ABAC, public routes, and secret/config boundaries.

## 4. Persistence & Transactions (data)
**Impact:** HIGH  
Prisma/TypeORM integration, service boundaries, constraints, transactions, concurrency, pagination, and N+1 prevention.

## 5. Errors & Observability (errors)
**Impact:** HIGH  
Exception filters, domain errors, error response contracts, contextual logging, and diagnostics.

## 6. Cross-Cutting Request Flow (cross)
**Impact:** MEDIUM-HIGH  
Pipes, interceptors, middleware, request context, lifecycle hooks, and where each concern belongs.

## 7. Performance & Runtime (perf)
**Impact:** MEDIUM-HIGH  
Provider scopes, caching, async work, queues, shutdown hooks, and request hot paths.

## 8. Transports & Integration Patterns (transport)
**Impact:** MEDIUM  
GraphQL, microservices, WebSockets, events, queues, and transport-specific contracts.

## 9. Testing Strategy (test)
**Impact:** MEDIUM  
Testing modules, provider overrides, e2e app bootstrap, contract tests, and transport tests.

## 10. Operations & Configuration (ops)
**Impact:** MEDIUM  
Config validation, health checks, observability, deployment defaults, and graceful operations.
