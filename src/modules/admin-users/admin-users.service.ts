import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

const LIST_FIELDS =
  'phoneNumber email profile.firstName profile.gender profile.birthDate profile.currentCity profile.residenceCountry profile.originCountry verificationStatus subscriptionTier coinBalance referralCode createdAt';

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AdminUsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async list(search: string | undefined, page: number, limit: number) {
    const filter: Record<string, any> = {};
    if (search?.trim()) {
      const re = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ phoneNumber: re }, { email: re }, { 'profile.firstName': re }];
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

  async exportCsv(): Promise<string> {
    const users = await this.userModel.find().select(LIST_FIELDS).sort({ createdAt: -1 });

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
