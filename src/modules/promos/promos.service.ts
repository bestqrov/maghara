import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { PromoCode } from '../../schemas/promo-code.schema';
import { RedeemPromoDto } from './dto/redeem-promo.dto';
import { CreatePromoDto } from './dto/create-promo.dto';

const SITE_URL = process.env.SITE_URL ?? 'https://9issmaonassib.com';

@Injectable()
export class PromosService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCode>,
  ) {}

  async redeem(userId: string, dto: RedeemPromoDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const code = dto.code.trim().toUpperCase();

    if (user.redeemedPromoCodes.includes(code)) {
      throw new BadRequestException('لقد استخدمت هذا الكود من قبل');
    }

    // Atomic claim: increments currentRedemptions only if the code is active,
    // unexpired, and still has room — so concurrent redemptions can never push
    // a code past maxRedemptions.
    const now = new Date();
    const promo = await this.promoCodeModel.findOneAndUpdate(
      {
        code,
        isActive: true,
        $expr: { $lt: ['$currentRedemptions', '$maxRedemptions'] },
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
      },
      { $inc: { currentRedemptions: 1 } },
      { new: true },
    );

    if (!promo) {
      const exists = await this.promoCodeModel.exists({ code });
      if (!exists) throw new BadRequestException('هذا الكود غير صالح');
      throw new BadRequestException('انتهت صلاحية هذا الكود أو تم استنفاذ عدد مرات استخدامه');
    }

    if (promo.requiresVerification && user.verificationStatus !== 'VERIFIED') {
      // Release the slot we just atomically claimed since this attempt fails.
      await this.promoCodeModel.updateOne({ _id: promo._id }, { $inc: { currentRedemptions: -1 } });
      throw new BadRequestException('يجب توثيق الحساب أولاً بالهوية للاستفادة من الكود');
    }

    this.applyReward(user, promo);
    user.redeemedPromoCodes.push(code);
    await user.save();

    return {
      message: 'تم تفعيل الكود بنجاح',
      type: promo.type,
      rewardValue: promo.rewardValue,
      subscriptionTier: user.subscriptionTier,
      coinBalance: user.coinBalance,
      vipExpiresAt: user.vipExpiresAt,
    };
  }

  private applyReward(user: User, promo: PromoCode) {
    switch (promo.type) {
      case 'VIP_DAYS': {
        const now = new Date();
        const base = user.vipExpiresAt && user.vipExpiresAt > now ? user.vipExpiresAt : now;
        user.vipExpiresAt = new Date(base.getTime() + promo.rewardValue * 24 * 60 * 60 * 1000);
        if (user.subscriptionTier === 'FREE') user.subscriptionTier = 'VIP';
        break;
      }
      case 'COINS':
        user.coinBalance += promo.rewardValue;
        break;
      case 'CROSS_BORDER_ACCESS':
        user.subscriptionTier = 'CROSS_BORDER_VIP';
        break;
    }
  }

  async getReferralInfo(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.referralCode) throw new BadRequestException('لا يتوفر رمز إحالة لهذا الحساب');

    const [totalReferred, verifiedReferred] = await Promise.all([
      this.userModel.countDocuments({ referredBy: user._id }),
      this.userModel.countDocuments({ referredBy: user._id, verificationStatus: 'VERIFIED' }),
    ]);

    return {
      referralCode: user.referralCode,
      referralLink: `${SITE_URL}/register?ref=${user.referralCode}`,
      totalReferred,
      verifiedReferred,
    };
  }

  // --- Admin ---

  async create(dto: CreatePromoDto) {
    const promo = await this.promoCodeModel.create({
      code: dto.code.trim().toUpperCase(),
      type: dto.type,
      rewardValue: dto.rewardValue,
      maxRedemptions: dto.maxRedemptions,
      requiresVerification: dto.requiresVerification ?? true,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      isActive: dto.isActive ?? true,
    });
    return promo;
  }

  async list() {
    return this.promoCodeModel.find().sort({ createdAt: -1 });
  }
}
