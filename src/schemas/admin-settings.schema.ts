import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** Singleton document (fixed _id) holding the one super-admin's credential. */
@Schema({ timestamps: true })
export class AdminSettings extends Document {
  @Prop({ required: true }) passwordHash: string;
}

export const AdminSettingsSchema = SchemaFactory.createForClass(AdminSettings);
