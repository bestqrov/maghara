import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedKey = request.headers['x-admin-key'];
    const adminKey = this.config.get<string>('ADMIN_API_KEY');

    if (!adminKey || providedKey !== adminKey) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    return true;
  }
}
