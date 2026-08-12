import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionTier = 'FREE' | 'VIP' | 'CROSS_BORDER_VIP';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type Gender = 'MALE' | 'FEMALE';
export type RelocationPreference = 'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY';

@Schema({ _id: false })
export class MatchCriteria {
  @Prop() minAge?: number;
  @Prop() maxAge?: number;
  @Prop({ type: [String], default: [] }) targetCountries: string[];
  @Prop({ type: [String], default: [] }) targetCities: string[];
}
export const MatchCriteriaSchema = SchemaFactory.createForClass(MatchCriteria);

@Schema({ _id: false })
export class VerificationDocuments {
  @Prop() idDocumentUrl?: string;
  @Prop() residencyDocumentUrl?: string;
  @Prop() rejectionReason?: string;
  @Prop() submittedAt?: Date;
}
export const VerificationDocumentsSchema = SchemaFactory.createForClass(VerificationDocuments);

@Schema({ _id: false })
export class Profile {
  @Prop({ required: true }) firstName: string;
  @Prop({ enum: ['MALE', 'FEMALE'], required: true }) gender: Gender;
  @Prop({ required: true }) birthDate: Date;
  @Prop({ required: true }) residenceCountry: string;
  @Prop({ required: true }) currentCity: string;
  @Prop({ required: true }) originCountry: string;
  @Prop({
    enum: ['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY'],
    default: 'OPEN_TO_MOVE',
  })
  relocationPreference: RelocationPreference;
  @Prop() jobTitle?: string;
  @Prop() educationLevel?: string;
  @Prop() bio?: string;
  @Prop({ type: [String], default: [] }) photos: string[];
  @Prop({ default: true }) isPhotoBlurred: boolean;
  @Prop({ type: MatchCriteriaSchema }) matchCriteria?: MatchCriteria;
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true }) phoneNumber: string;
  @Prop({ unique: true, sparse: true }) email?: string;
  @Prop({ required: true }) passwordHash: string;

  @Prop({ default: false }) isVerified: boolean;
  @Prop({
    enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
    default: 'UNVERIFIED',
  })
  verificationStatus: VerificationStatus;
  @Prop({ type: VerificationDocumentsSchema })
  verificationDocuments?: VerificationDocuments;

  @Prop({ enum: ['FREE', 'VIP', 'CROSS_BORDER_VIP'], default: 'FREE' })
  subscriptionTier: SubscriptionTier;
  @Prop({ default: 0 }) coinBalance: number;
  @Prop({ default: 0 }) dailyInterestsSent: number;
  @Prop({ default: () => new Date() }) lastInterestReset: Date;

  @Prop({ type: ProfileSchema, required: true }) profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ 'profile.currentCity': 1 });
UserSchema.index({ 'profile.residenceCountry': 1 });
