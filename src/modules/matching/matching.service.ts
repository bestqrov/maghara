import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from '../../schemas/match.schema';
import { User } from '../../schemas/user.schema';
import { SearchProfilesDto } from './dto/search-profiles.dto';
import { resolveIsVip } from '../../common/utils/subscription.util';
import { isUserOnline } from '../../common/utils/online-status.util';

const FREE_UNBLURRED_RESULTS = 2;
const DAILY_FREE_INTERESTS = 5;

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactCaseInsensitive(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, 'i');
}

function ageFromBirthDate(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) age--;
  return age;
}

function includesCaseInsensitive(list: string[], value?: string): boolean {
  if (!value) return false;
  return list.some((item) => item.toLowerCase() === value.toLowerCase());
}

/**
 * A 0-100 heuristic blending four signals, each scored only when both sides
 * actually stated a preference (unstated preferences are treated as neutral
 * rather than penalized, since most profiles never fill in matchCriteria).
 */
function computeCompatibility(me: User, candidate: User): number {
  let score = 0;

  // Age fit (30): candidate's age within my stated range and vice versa.
  const myCriteria = me.profile.matchCriteria;
  const candidateCriteria = candidate.profile.matchCriteria;
  const candidateAge = ageFromBirthDate(candidate.profile.birthDate);
  const myAge = ageFromBirthDate(me.profile.birthDate);

  const iWantTheirAge = !myCriteria?.minAge && !myCriteria?.maxAge
    ? true
    : (!myCriteria.minAge || candidateAge >= myCriteria.minAge) && (!myCriteria.maxAge || candidateAge <= myCriteria.maxAge);
  const theyWantMyAge = !candidateCriteria?.minAge && !candidateCriteria?.maxAge
    ? true
    : (!candidateCriteria.minAge || myAge >= candidateCriteria.minAge) &&
      (!candidateCriteria.maxAge || myAge <= candidateCriteria.maxAge);
  score += (iWantTheirAge ? 15 : 0) + (theyWantMyAge ? 15 : 0);

  // Location fit (30): candidate's city/country among my targets, or same residence country.
  const myTargets = myCriteria?.targetCountries ?? [];
  const myTargetCities = myCriteria?.targetCities ?? [];
  if (myTargets.length === 0 && myTargetCities.length === 0) {
    score += 15;
  } else if (
    includesCaseInsensitive(myTargetCities, candidate.profile.currentCity) ||
    includesCaseInsensitive(myTargets, candidate.profile.residenceCountry)
  ) {
    score += 15;
  }
  if (candidate.profile.residenceCountry.toLowerCase() === me.profile.residenceCountry.toLowerCase()) {
    score += 15;
  } else if (candidate.profile.relocationPreference !== 'LOCAL_ONLY' && me.profile.relocationPreference !== 'LOCAL_ONLY') {
    score += 8;
  }

  // Relocation stance fit (20): neither is strictly local-only when the other lives elsewhere.
  const sameCountry = candidate.profile.residenceCountry.toLowerCase() === me.profile.residenceCountry.toLowerCase();
  if (sameCountry) {
    score += 20;
  } else if (me.profile.relocationPreference !== 'LOCAL_ONLY' && candidate.profile.relocationPreference !== 'LOCAL_ONLY') {
    score += 20;
  } else if (me.profile.relocationPreference === 'LOOKING_FOR_EXPAT' || candidate.profile.relocationPreference === 'LOOKING_FOR_EXPAT') {
    score += 10;
  }

  // Shared roots (20): same country of origin.
  if (candidate.profile.originCountry.toLowerCase() === me.profile.originCountry.toLowerCase()) {
    score += 20;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
  ) {}

  async search(userId: string, dto: SearchProfilesDto) {
    const me = await this.userModel.findById(userId);
    if (!me) throw new NotFoundException('User not found');

    const isVip = await resolveIsVip(me);
    const oppositeGender = me.profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

    const filter: Record<string, any> = {
      _id: { $ne: me._id },
      'profile.gender': oppositeGender,
    };

    const targetCountry = dto.targetCountry || (dto.scope === 'LOCAL' ? me.profile.residenceCountry : undefined);
    const relocationPreference =
      dto.relocationPreference || (dto.scope === 'DIASPORA' ? 'LOOKING_FOR_EXPAT' : undefined);

    if (targetCountry) filter['profile.residenceCountry'] = exactCaseInsensitive(targetCountry);
    if (dto.targetCity) filter['profile.currentCity'] = exactCaseInsensitive(dto.targetCity);
    if (relocationPreference) filter['profile.relocationPreference'] = relocationPreference;
    if (dto.minAge || dto.maxAge) {
      const now = new Date();
      filter['profile.birthDate'] = {};
      if (dto.maxAge) {
        filter['profile.birthDate'].$gte = new Date(now.getFullYear() - dto.maxAge, now.getMonth(), now.getDate());
      }
      if (dto.minAge) {
        filter['profile.birthDate'].$lte = new Date(now.getFullYear() - dto.minAge, now.getMonth(), now.getDate());
      }
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const results = await this.userModel
      .find(filter)
      .sort({ isVerified: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('profile isVerified verificationStatus subscriptionTier lastActiveAt');

    if (isVip) {
      return results.map((r) => {
        const { lastActiveAt, ...rest } = r.toObject();
        return { ...rest, blurred: false, compatibilityScore: computeCompatibility(me, r), isOnline: isUserOnline(lastActiveAt) };
      });
    }

    return results.map((r, index) => {
      const { lastActiveAt, ...rest } = r.toObject();
      return {
        ...rest,
        blurred: index >= FREE_UNBLURRED_RESULTS,
        compatibilityScore: computeCompatibility(me, r),
        isOnline: isUserOnline(lastActiveAt),
      };
    });
  }

  async sendInterest(senderId: string, receiverId: string, isSuperLike = false) {
    if (senderId === receiverId) throw new BadRequestException('Cannot send interest to yourself');

    const sender = await this.resetDailyCounterIfNeeded(senderId);
    const isVip = await resolveIsVip(sender);

    if (!isVip && sender.dailyInterestsSent >= DAILY_FREE_INTERESTS) {
      throw new BadRequestException('Daily free interest limit reached. Upgrade to VIP or use coins.');
    }

    if (isSuperLike && !isVip) {
      if (sender.coinBalance < 1) {
        throw new BadRequestException('Insufficient coins for Super Like');
      }
      sender.coinBalance -= 1;
    }

    try {
      const match = await this.matchModel.create({
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        isSuperLike,
      });
      sender.dailyInterestsSent += 1;
      await sender.save();
      return match;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Interest already sent to this profile');
      }
      throw err;
    }
  }

  async getMyMatches(userId: string) {
    const matches = await this.matchModel
      .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .sort({ updatedAt: -1 })
      .populate('senderId', 'profile.firstName profile.photos isVerified lastActiveAt')
      .populate('receiverId', 'profile.firstName profile.photos isVerified lastActiveAt');

    return matches.map((match) => {
      const m = match as any;
      const isSender = m.senderId._id.toString() === userId;
      const other = isSender ? m.receiverId : m.senderId;
      const { lastActiveAt, ...otherRest } = other.toObject();
      return {
        _id: m._id,
        status: m.status,
        isSuperLike: m.isSuperLike,
        direction: isSender ? 'SENT' : 'RECEIVED',
        otherUser: { ...otherRest, isOnline: isUserOnline(lastActiveAt) },
        createdAt: m.createdAt,
      };
    });
  }

  async respondToMatch(userId: string, matchId: string, accept: boolean) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');
    if (match.receiverId.toString() !== userId) {
      throw new BadRequestException('Only the receiver can respond to this interest');
    }

    match.status = accept ? 'ACCEPTED' : 'REJECTED';
    await match.save();
    return match;
  }

  async markAsEngaged(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    const isParticipant = [match.senderId.toString(), match.receiverId.toString()].includes(userId);
    if (!isParticipant) throw new BadRequestException('Not a participant in this match');
    if (match.status !== 'ACCEPTED') {
      throw new BadRequestException('Match must be accepted before it can be marked as engaged');
    }

    match.status = 'ENGAGED';
    await match.save();
    return match;
  }

  private async resetDailyCounterIfNeeded(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isSameDay = this.isSameCalendarDay(user.lastInterestReset, new Date());
    if (!isSameDay) {
      user.dailyInterestsSent = 0;
      user.lastInterestReset = new Date();
    }
    return user;
  }

  private isSameCalendarDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
}
