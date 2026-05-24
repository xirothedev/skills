// CORRECT: Public, Next.js server-only, and NestJS backend env are separate.
export const webPublicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
};

export const webServerEnv = {
  apiOrigin: process.env.NEXT_SERVER_API_ORIGIN!,
};
