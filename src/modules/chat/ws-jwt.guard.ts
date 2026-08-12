import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);
    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      const payload = this.jwtService.verify(token);
      (client.data as any).user = { userId: payload.sub, phoneNumber: payload.phoneNumber };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid auth token');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const header = client.handshake.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);
    return client.handshake.auth?.token as string | undefined;
  }
}
