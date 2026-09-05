import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Transaction } from '../../schemas/transaction.schema';
import { PromoCode } from '../../schemas/promo-code.schema';

const MONTHS_BACK = 6;

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCode>,
  ) {}

  async getOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const rangeStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);

    const notSeed = { isSeed: { $ne: true } };
    const [totalUsers, verifiedUsers, vipUsers, newUsersThisMonth] = await Promise.all([
      this.userModel.countDocuments(notSeed),
      this.userModel.countDocuments({ ...notSeed, verificationStatus: 'VERIFIED' }),
      this.userModel.countDocuments({ ...notSeed, subscriptionTier: { $in: ['VIP', 'CROSS_BORDER_VIP'] } }),
      this.userModel.countDocuments({ ...notSeed, createdAt: { $gte: startOfMonth } }),
    ]);

    const [totalRevenueAgg, thisMonthRevenueAgg, revenueByType, revenueByMonth, pendingVerifications, pendingPayments, activePromoCodes] =
      await Promise.all([
        this.transactionModel.aggregate([
          { $match: { status: 'SUCCESS' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.transactionModel.aggregate([
          { $match: { status: 'SUCCESS', createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.transactionModel.aggregate([
          { $match: { status: 'SUCCESS' } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ]),
        this.transactionModel.aggregate([
          { $match: { status: 'SUCCESS', createdAt: { $gte: rangeStart } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              total: { $sum: '$amount' },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        this.userModel.countDocuments({ verificationStatus: 'PENDING' }),
        this.transactionModel.countDocuments({ status: 'PENDING' }),
        this.promoCodeModel.countDocuments({ isActive: true }),
      ]);

    const byType: Record<string, number> = { COIN_PURCHASE: 0, VIP_SUBSCRIPTION: 0, VERIFICATION_FEE: 0 };
    for (const row of revenueByType as { _id: string; total: number }[]) {
      byType[row._id] = row.total;
    }

    const byMonthMap = new Map((revenueByMonth as { _id: string; total: number }[]).map((r) => [r._id, r.total]));
    const byMonth: { month: string; total: number }[] = [];
    for (let i = MONTHS_BACK - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth.push({ month: key, total: byMonthMap.get(key) ?? 0 });
    }

    return {
      users: { total: totalUsers, verified: verifiedUsers, vip: vipUsers, newThisMonth: newUsersThisMonth },
      revenue: {
        total: (totalRevenueAgg[0]?.total as number) ?? 0,
        thisMonth: (thisMonthRevenueAgg[0]?.total as number) ?? 0,
        byType,
        byMonth,
      },
      pending: { verifications: pendingVerifications, payments: pendingPayments },
      promos: { active: activePromoCodes },
    };
  }
}
