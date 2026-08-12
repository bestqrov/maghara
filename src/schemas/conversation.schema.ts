import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Conversation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Match', required: true, unique: true })
  matchId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

  @Prop({ default: 0 }) totalMessagesCount: number;
  @Prop({ default: false }) isLockedForFree: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  unlockedBy: Types.ObjectId[];

  @Prop({ default: () => new Date() }) lastMessageAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
