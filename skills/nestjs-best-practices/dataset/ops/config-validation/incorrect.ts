import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtSettings {
  readonly ttlSeconds = Number(process.env.JWT_TTL_SECONDS);
  readonly secret = process.env.JWT_SECRET;
}
