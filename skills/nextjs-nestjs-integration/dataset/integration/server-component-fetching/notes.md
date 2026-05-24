Server Components should not call the Next.js app's own Route Handlers. Directly use the NestJS client or server-only DAL to avoid build-time failures and extra HTTP round trips.
