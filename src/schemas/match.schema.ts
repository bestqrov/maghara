import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ENGAGED';

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'ENGAGED'], default: 'PENDING' })
  status: MatchStatus;

  @Prop({ default: false }) isSuperLike: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
