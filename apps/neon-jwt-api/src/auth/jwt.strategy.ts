import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { StrategyOptions } from "passport-jwt";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_SECRET is not set. Add it to apps/neon-jwt-api/.env (see README)."
      );
    }
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };
    super(opts);
  }

  validate(payload: { sub: number; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}
