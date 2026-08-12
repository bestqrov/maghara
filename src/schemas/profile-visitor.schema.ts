import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ProfileVisitor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  visitedProfileId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  visitorId: Types.ObjectId;

  @Prop({ default: () => new Date() }) visitedAt: Date;
}

export const ProfileVisitorSchema = SchemaFactory.createForClass(ProfileVisitor);
ProfileVisitorSchema.index({ visitedProfileId: 1, visitedAt: -1 });
