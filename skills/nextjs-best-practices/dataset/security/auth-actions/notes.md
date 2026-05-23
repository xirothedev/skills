# Authenticate Server Actions Like API Routes

Server Actions are callable from the client. Always verify authentication and authorization before performing mutations. Treat every Server Action as a public API endpoint.

## Why This Matters

- Server Actions have URLs and can be called by anyone
- No automatic authentication protection
- Unprotected actions allow unauthorized data modification
- Same security posture required as REST API routes

## Security Checklist

1. Verify user is authenticated at the start of every mutation
2. Check resource ownership before modification
3. Validate input with Zod or similar
4. Return meaningful errors for unauthorized access
5. Log security-relevant actions

## References

- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security
- https://nextjs.org/docs/app/building-your-application/authentication