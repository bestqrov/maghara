import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { generateUniqueReferralCode } from '../../common/utils/referral-code.util';
import { normalizeCountryInput } from '../../common/utils/country.util';
import { UsersService } from '../users/users.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/admin-member.dto';

const LIST_FIELDS =
  'phoneNumber email profile.firstName profile.gender profile.birthDate profile.currentCity profile.residenceCountry profile.originCountry verificationStatus subscriptionTier coinBalance referralCode createdAt';

const BCRYPT_ROUNDS = 12;
const PRIVATE_FIELDS =
  '-passwordHash -passwordResetTokenHash -passwordResetExpiresAt';
const PROFILE_FIELDS = [
  'firstName',
  'gender',
  'birthDate',
  'residenceCountry',
  'currentCity',
  'originCountry',
] as const;

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
  ) {}

  async list(search: string | undefined, page: number, limit: number) {
    const filter: Record<string, any> = {};
    if (search?.trim()) {
      const re = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { phoneNumber: re },
        { email: re },
        { 'profile.firstName': re },
      ];
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select(LIST_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.userModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid member id');
    const user = await this.userModel.findById(id).select(PRIVATE_FIELDS);
    if (!user) throw new NotFoundException('Member not found');
    return user;
  }

  async create(dto: CreateMemberDto) {
    const email = dto.email.trim().toLowerCase();
    await this.assertUnique(dto.phoneNumber, email);

    const verificationStatus = dto.verificationStatus ?? 'UNVERIFIED';
    const user = await this.userModel.create({
      phoneNumber: dto.phoneNumber.trim(),
      email,
      passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
      referralCode: await generateUniqueReferralCode(this.userModel),
      subscriptionTier: dto.subscriptionTier ?? 'FREE',
      verificationStatus,
      isVerified: verificationStatus === 'VERIFIED',
      coinBalance: dto.coinBalance ?? 0,
      profile: {
        firstName: dto.firstName,
        gender: dto.gender,
        birthDate: dto.birthDate,
        residenceCountry: normalizeCountryInput(dto.residenceCountry),
        currentCity: dto.currentCity,
        originCountry: normalizeCountryInput(dto.originCountry),
      },
    });

    return this.findOne(String(user._id));
  }

  async update(id: string, dto: UpdateMemberDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid member id');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Member not found');

    const phoneNumber = dto.phoneNumber?.trim();
    const email = dto.email?.trim().toLowerCase();
    await this.assertUnique(
      phoneNumber && phoneNumber !== user.phoneNumber ? phoneNumber : undefined,
      email && email !== user.email ? email : undefined,
    );
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (dto.password)
      user.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    for (const key of PROFILE_FIELDS) {
      const value = dto[key];
      if (value === undefined) continue;
      (user.profile as unknown as Record<string, unknown>)[key] =
        key === 'residenceCountry' || key === 'originCountry'
          ? normalizeCountryInput(value)
          : value;
    }

    if (
      dto.subscriptionTier &&
      dto.subscriptionTier !== user.subscriptionTier
    ) {
      user.subscriptionTier = dto.subscriptionTier;
      // A tier set by hand is permanent, like a paid one — drop any promo/campaign expiry.
      user.vipExpiresAt = undefined;
    }
    if (dto.verificationStatus) {
      user.verificationStatus = dto.verificationStatus;
      user.isVerified = dto.verificationStatus === 'VERIFIED';
    }
    if (dto.coinBalance !== undefined) user.coinBalance = dto.coinBalance;

    await user.save();
    return this.findOne(id);
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid member id');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Member not found');
    await this.usersService.purgeUser(user);
    return { message: 'Member deleted' };
  }

  private async assertUnique(phoneNumber?: string, email?: string) {
    if (phoneNumber && (await this.userModel.exists({ phoneNumber }))) {
      throw new ConflictException('Phone number already registered');
    }
    if (email && (await this.userModel.exists({ email }))) {
      throw new ConflictException('Email already registered');
    }
  }

  async exportCsv(): Promise<string> {
    const users = await this.userModel
      .find()
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 });

    const header = [
      'firstName',
      'gender',
      'phoneNumber',
      'email',
      'currentCity',
      'residenceCountry',
      'originCountry',
      'verificationStatus',
      'subscriptionTier',
      'coinBalance',
      'referralCode',
      'createdAt',
    ];

    const escapeCsv = (value: unknown) => {
      const str = value === undefined || value === null ? '' : String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = users.map((u) =>
      [
        u.profile.firstName,
        u.profile.gender,
        u.phoneNumber,
        u.email ?? '',
        u.profile.currentCity,
        u.profile.residenceCountry,
        u.profile.originCountry,
        u.verificationStatus,
        u.subscriptionTier,
        u.coinBalance,
        u.referralCode ?? '',
        (u as any).createdAt?.toISOString?.() ?? '',
      ]
        .map(escapeCsv)
        .join(','),
    );

    return [header.join(','), ...rows].join('\n');
  }
}
