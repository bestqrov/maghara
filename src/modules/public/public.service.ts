import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { PublicProfilesQueryDto } from './dto/public-profiles-query.dto';

const PREVIEW_FIELDS =
  'profile.firstName profile.gender profile.birthDate profile.currentCity profile.residenceCountry verificationStatus';

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactCaseInsensitive(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, 'i');
}

function calculateAge(birthDate: Date) {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

@Injectable()
export class PublicService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  /**
   * Anonymous preview for marketing/SEO pages. Deliberately returns no photo
   * URLs and no contact info — just enough to prove real verified members
   * exist in a given city/country, without exposing real user media to
   * unauthenticated crawlers/scrapers.
   */
  async getVerifiedPreviewProfiles(dto: PublicProfilesQueryDto) {
    const filter: Record<string, unknown> = { verificationStatus: 'VERIFIED', isSeed: { $ne: true } };
    if (dto.city) filter['profile.currentCity'] = exactCaseInsensitive(dto.city);
    if (dto.country) filter['profile.residenceCountry'] = exactCaseInsensitive(dto.country);

    const limit = dto.limit ?? 6;

    const results = await this.userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(PREVIEW_FIELDS);

    return results.map((r) => ({
      firstName: r.profile.firstName,
      gender: r.profile.gender,
      age: calculateAge(r.profile.birthDate),
      currentCity: r.profile.currentCity,
      residenceCountry: r.profile.residenceCountry,
      isVerified: true,
    }));
  }
}
