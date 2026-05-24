// CORRECT: Multi-instance self-hosting requires a stable Server Actions key.
export const requiredRuntimeEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY",
];
