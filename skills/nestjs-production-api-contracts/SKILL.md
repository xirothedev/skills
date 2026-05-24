---
name: nestjs-production-api-contracts
description: Use for production NestJS API contract work involving OpenAPI/Swagger, DTO validation, versioning, public error envelopes, guards and policy authorization, rate limiting behind proxies, CORS/helmet/cookie hardening, or file upload boundaries.
metadata:
  author: xiro
  version: "0.1.0"
  organization: local
  date: May 2026
  framework: NestJS
  frameworkVersion: "v11.1.16"
  supportedVersions:
    - "10.x.x"
    - "11.x.x"
  priority: high
  abstract: Focused NestJS skill for real production API contracts: OpenAPI, DTOs, versioning, error contracts, guards/policies, throttling, HTTP hardening, and upload boundaries.
---

# NestJS Production API Contracts

Use this skill when a NestJS API must be stable, documented, secure, and safe to expose to clients. Treat controllers as public contracts and services as internal behavior.

## When to Apply

Use this skill when:
- Writing or reviewing OpenAPI decorators, DTOs, response schemas, or API versioning
- Designing public error envelopes or exception filters
- Implementing guards, policy checks, roles, ownership, or tenant authorization
- Configuring rate limits behind a proxy, CORS, helmet, cookies, or upload limits
- Auditing controller methods that accept raw request bodies, files, or unbounded data

## Load On Demand

Start with this file. Load detailed files only when the task needs them:

```
references/_sections.md
references/api-openapi-contracts.md
references/api-versioning-error-contracts.md
references/security-policy-guards.md
references/security-rate-limit-proxy.md
references/security-http-hardening.md
references/api-file-upload-boundary.md
dataset/api/openapi-contracts/correct.ts
sources/inventory.json
```

Each rule file includes:
- Why the pattern matters
- Incorrect and correct examples
- Dataset path with larger TypeScript examples
- Official source references

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | API Contracts | CRITICAL | `api-` |
| 2 | Security & Authorization | CRITICAL | `security-` |
| 3 | Operations | HIGH | `ops-` |

## Source Policy

Prefer official NestJS docs and official package docs for `@nestjs/swagger`, `@nestjs/throttler`, and HTTP platform behavior. Do not let generated OpenAPI docs drift from actual DTOs and response behavior.
