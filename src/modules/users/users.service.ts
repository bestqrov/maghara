import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { Match } from '../../schemas/match.schema';
import { Conversation } from '../../schemas/conversation.schema';
import { Message } from '../../schemas/message.schema';
import { ProfileVisitor } from '../../schemas/profile-visitor.schema';
import { PushSubscription } from '../../schemas/push-subscription.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(ProfileVisitor.name) private readonly profileVisitorModel: Model<ProfileVisitor>,
    @InjectModel(PushSubscription.name) private readonly pushSubscriptionModel: Model<PushSubscription>,
  ) {}

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { minAge, maxAge, targetCountries, targetCities, ...profileFields } = dto;
    for (const [key, value] of Object.entries(profileFields)) {
      if (value !== undefined) {
        (user.profile as unknown as Record<string, unknown>)[key] = value;
      }
    }

    if (minAge !== undefined || maxAge !== undefined || targetCountries || targetCities) {
      user.profile.matchCriteria = {
        ...user.profile.matchCriteria,
        ...(minAge !== undefined && { minAge }),
        ...(maxAge !== undefined && { maxAge }),
        ...(targetCountries && { targetCountries }),
        ...(targetCities && { targetCities }),
      } as any;
    }

    await user.save();
    return this.findById(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    user.passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    const conversations = await this.conversationModel.find({ participants: userId }).select('_id');
    const conversationIds = conversations.map((c) => c._id);

    await Promise.all([
      this.matchModel.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
      this.conversationModel.deleteMany({ participants: userId }),
      this.messageModel.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }, { conversationId: { $in: conversationIds } }] }),
      this.profileVisitorModel.deleteMany({ $or: [{ visitorId: userId }, { visitedProfileId: userId }] }),
      this.pushSubscriptionModel.deleteMany({ userId }),
    ]);

    await user.deleteOne();
    return { message: 'Account deleted' };
  }
}
