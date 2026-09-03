import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { generateUniqueReferralCode } from '../../common/utils/referral-code.util';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async isPhoneAvailable(phoneNumber: string) {
    if (!phoneNumber) return true;
    const existing = await this.userModel.findOne({ phoneNumber }).select('_id');
    return !existing;
  }

  async register(dto: RegisterDto) {
    const existingPhone = await this.userModel.findOne({ phoneNumber: dto.phoneNumber });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    const existingEmail = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const referralCode = await generateUniqueReferralCode(this.userModel);

    // Best-effort: an unknown/malformed referral code should never block signup.
    let referredBy: Types.ObjectId | undefined;
    if (dto.referralCode) {
      const referrer = await this.userModel.findOne({ referralCode: dto.referralCode.trim().toUpperCase() });
      if (referrer) referredBy = referrer._id as Types.ObjectId;
    }

    const user = await this.userModel.create({
      phoneNumber: dto.phoneNumber,
      email: dto.email.toLowerCase(),
      passwordHash,
      referralCode,
      referredBy,
      profile: {
        firstName: dto.firstName,
        gender: dto.gender,
        birthDate: dto.birthDate,
        residenceCountry: dto.residenceCountry,
        currentCity: dto.currentCity,
        originCountry: dto.originCountry,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ phoneNumber: dto.phoneNumber });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User) {
    const userId = (user._id as Types.ObjectId).toString();
    const payload = { sub: userId, phoneNumber: user.phoneNumber };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userId,
        phoneNumber: user.phoneNumber,
        subscriptionTier: user.subscriptionTier,
        referralCode: user.referralCode,
        profile: user.profile,
      },
    };
  }
}
