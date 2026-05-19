import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

function validateEnv(env: Record<string, string | undefined>) {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  const ttlSeconds = Number(env.JWT_TTL_SECONDS ?? "3600");
  if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
    throw new Error("JWT_TTL_SECONDS must be a positive integer");
  }
  return { ...env, JWT_TTL_SECONDS: String(ttlSeconds) };
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv })],
})
export class AppConfigModule {}
