import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from '../../schemas/match.schema';
import { User } from '../../schemas/user.schema';
import { SearchProfilesDto } from './dto/search-profiles.dto';

const FREE_UNBLURRED_RESULTS = 2;
const DAILY_FREE_INTERESTS = 5;

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
  ) {}

  async search(userId: string, dto: SearchProfilesDto) {
    const me = await this.userModel.findById(userId);
    if (!me) throw new NotFoundException('User not found');

    const isVip = me.subscriptionTier === 'VIP' || me.subscriptionTier === 'CROSS_BORDER_VIP';
    const oppositeGender = me.profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

    const filter: Record<string, any> = {
      _id: { $ne: me._id },
      'profile.gender': oppositeGender,
    };

    if (dto.targetCountry) filter['profile.residenceCountry'] = dto.targetCountry;
    if (dto.targetCity) filter['profile.currentCity'] = dto.targetCity;
    if (dto.relocationPreference) filter['profile.relocationPreference'] = dto.relocationPreference;
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
      .select('profile isVerified verificationStatus subscriptionTier');

    if (isVip) {
      return results.map((r) => ({ ...r.toObject(), blurred: false }));
    }

    return results.map((r, index) => ({
      ...r.toObject(),
      blurred: index >= FREE_UNBLURRED_RESULTS,
    }));
  }

  async sendInterest(senderId: string, receiverId: string, isSuperLike = false) {
    if (senderId === receiverId) throw new BadRequestException('Cannot send interest to yourself');

    const sender = await this.resetDailyCounterIfNeeded(senderId);
    const isVip = sender.subscriptionTier === 'VIP' || sender.subscriptionTier === 'CROSS_BORDER_VIP';

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
