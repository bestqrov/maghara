import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfileVisitor } from '../../schemas/profile-visitor.schema';
import { User } from '../../schemas/user.schema';

const FREE_VISIBLE_VISITORS = 8;
const FREE_TEASER_VISITORS = 2;

@Injectable()
export class VisitorsService {
  constructor(
    @InjectModel(ProfileVisitor.name) private readonly visitorModel: Model<ProfileVisitor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async recordVisit(visitorId: string, visitedProfileId: string) {
    if (visitorId === visitedProfileId) return;

    await this.visitorModel.findOneAndUpdate(
      { visitorId: new Types.ObjectId(visitorId), visitedProfileId: new Types.ObjectId(visitedProfileId) },
      { visitedAt: new Date() },
      { upsert: true },
    );
  }

  async getMyVisitors(userId: string) {
    const user = await this.userModel.findById(userId);
    const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';

    const fetchLimit = isVip
      ? undefined
      : FREE_VISIBLE_VISITORS + FREE_TEASER_VISITORS;

    let query = this.visitorModel
      .find({ visitedProfileId: new Types.ObjectId(userId) })
      .sort({ visitedAt: -1 })
      .populate('visitorId', 'profile subscriptionTier');

    if (fetchLimit) query = query.limit(fetchLimit);

    const visits = await query.exec();

    if (isVip) {
      return visits.map((v) => ({ visitor: v.visitorId, visitedAt: v.visitedAt, locked: false }));
    }

    return visits.map((v, index) => ({
      visitor: index < FREE_VISIBLE_VISITORS ? v.visitorId : null,
      visitedAt: v.visitedAt,
      locked: index >= FREE_VISIBLE_VISITORS,
    }));
  }
}
