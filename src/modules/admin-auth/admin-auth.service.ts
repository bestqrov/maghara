import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminSettings } from '../../schemas/admin-settings.schema';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(AdminSettings.name) private readonly adminSettingsModel: Model<AdminSettings>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * First call ever seeds the one admin document from ADMIN_INITIAL_PASSWORD
   * (falling back to the legacy ADMIN_API_KEY so a deployment that already
   * had that set keeps working) so there's always something to log in with
   * before anyone has used the change-password flow.
   */
  private async getOrSeedSettings() {
    const existing = await this.adminSettingsModel.findOne();
    if (existing) return existing;

    const seed = this.config.get<string>('ADMIN_INITIAL_PASSWORD') ?? this.config.get<string>('ADMIN_API_KEY');
    if (!seed) {
      throw new InternalServerErrorException('No admin credential is configured on this server');
    }
    const passwordHash = await bcrypt.hash(seed, BCRYPT_ROUNDS);
    return this.adminSettingsModel.create({ passwordHash });
  }

  async login(password: string) {
    const settings = await this.getOrSeedSettings();
    const isMatch = await bcrypt.compare(password, settings.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const accessToken = this.jwtService.sign({ sub: 'admin', phoneNumber: 'admin', role: 'admin' });
    return { accessToken };
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const settings = await this.getOrSeedSettings();
    const isMatch = await bcrypt.compare(currentPassword, settings.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    settings.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await settings.save();
    return { message: 'Password changed successfully' };
  }
}
