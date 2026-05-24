---
title: Centralize HTTP Hardening in Bootstrap
impact: HIGH
impactDescription: Prevents inconsistent CORS, cookie, header, and body-size policy across controllers
tags: cors, helmet, cookies, bootstrap, security
dataset: security/http-hardening
---

## Centralize HTTP Hardening in Bootstrap

HTTP hardening belongs in application bootstrap and platform adapters, not scattered per controller. Configure CORS allowlists, secure cookies, Helmet, body limits, and proxy trust together.

**Incorrect (wildcard CORS):**

```typescript
app.enableCors({ origin: true, credentials: true });
```

**Correct (explicit origins):**

```typescript
app.enableCors({
  origin: config.allowedOrigins,
  credentials: true,
});
```

## Source References

- https://docs.nestjs.com/security/cors
- https://docs.nestjs.com/security/helmet
