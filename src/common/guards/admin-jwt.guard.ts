import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Same JWT as regular users, but only accepts a token whose payload carries role: 'admin'. */
@Injectable()
export class AdminJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = { role?: string }>(err: unknown, user: TUser): TUser {
    if (err || !user || (user as { role?: string }).role !== 'admin') {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    return user;
  }
}
