import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../schemas/user.schema';
import { ONLINE_THRESHOLD_MS } from '../../common/utils/online-status.util';

export interface JwtPayload {
  sub: string;
  phoneNumber: string;
  role?: 'admin';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.role) {
      // Fire-and-forget, throttled: only writes once per online-threshold window per user,
      // so marking someone "online" doesn't cost a write on every single authenticated request.
      const staleBefore = new Date(Date.now() - ONLINE_THRESHOLD_MS);
      this.userModel
        .updateOne(
          { _id: payload.sub, $or: [{ lastActiveAt: { $exists: false } }, { lastActiveAt: { $lt: staleBefore } }] },
          { $set: { lastActiveAt: new Date() } },
        )
        .exec()
        .catch(() => {});
    }
    return { userId: payload.sub, phoneNumber: payload.phoneNumber, role: payload.role };
  }
}
