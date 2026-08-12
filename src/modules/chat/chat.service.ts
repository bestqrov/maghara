import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from '../../schemas/conversation.schema';
import { Message } from '../../schemas/message.schema';
import { Match } from '../../schemas/match.schema';
import { User } from '../../schemas/user.schema';
import { containsContactInfo } from './moderation.util';

const FREE_MESSAGE_LIMIT = 10;
const UNLOCK_COIN_COST = 5;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getOrCreateConversation(matchId: string, userId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');
    if (match.status !== 'ACCEPTED' && match.status !== 'ENGAGED') {
      throw new BadRequestException('Chat is only available for accepted matches');
    }

    const participantIds = [match.senderId.toString(), match.receiverId.toString()];
    if (!participantIds.includes(userId)) throw new ForbiddenException('Not a participant in this match');

    let conversation = await this.conversationModel.findOne({ matchId: match._id });
    if (!conversation) {
      conversation = await this.conversationModel.create({
        matchId: match._id,
        participants: [match.senderId, match.receiverId],
      });
    }
    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, text: string) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const participantIds = conversation.participants.map((p) => p.toString());
    if (!participantIds.includes(senderId)) throw new ForbiddenException('Not a participant in this conversation');

    const receiverId = participantIds.find((id) => id !== senderId);
    if (!receiverId) throw new BadRequestException('Conversation is missing a receiver');

    if (containsContactInfo(text)) {
      throw new BadRequestException('Sharing phone numbers or social media links is not allowed');
    }

    const canSend = await this.canSendMessage(conversation, senderId);
    if (!canSend) {
      throw new ForbiddenException(
        'Free message limit reached. Upgrade to VIP or spend coins to continue this conversation.',
      );
    }

    const message = await this.messageModel.create({
      conversationId: conversation._id,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      messageText: text,
    });

    conversation.totalMessagesCount += 1;
    conversation.lastMessageAt = new Date();
    if (conversation.totalMessagesCount >= FREE_MESSAGE_LIMIT) {
      conversation.isLockedForFree = true;
    }
    await conversation.save();

    return message;
  }

  async unlockConversationWithCoins(conversationId: string, userId: string) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.coinBalance < UNLOCK_COIN_COST) throw new BadRequestException('Insufficient coins');

    user.coinBalance -= UNLOCK_COIN_COST;
    await user.save();

    conversation.unlockedBy.push(user._id as Types.ObjectId);
    await conversation.save();
    return conversation;
  }

  private async canSendMessage(conversation: Conversation, senderId: string): Promise<boolean> {
    if (conversation.totalMessagesCount < FREE_MESSAGE_LIMIT) return true;

    const sender = await this.userModel.findById(senderId);
    if (!sender) return false;

    const isVip = sender.subscriptionTier === 'VIP' || sender.subscriptionTier === 'CROSS_BORDER_VIP';
    if (isVip) return true;

    return conversation.unlockedBy.some((id) => id.toString() === senderId);
  }
}
