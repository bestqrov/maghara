import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

const TIERS = ['FREE', 'VIP', 'CROSS_BORDER_VIP'] as const;
const VERIFICATION_STATUSES = [
  'UNVERIFIED',
  'PENDING',
  'VERIFIED',
  'REJECTED',
] as const;

export class CreateMemberDto {
  @IsString() phoneNumber: string;
  @IsEmail() email: string;
  @MinLength(8) password: string;

  @IsString() firstName: string;
  @IsIn(['MALE', 'FEMALE']) gender: 'MALE' | 'FEMALE';
  @IsDateString() birthDate: string;
  @IsString() residenceCountry: string;
  @IsString() currentCity: string;
  @IsString() originCountry: string;

  @IsOptional() @IsIn(TIERS) subscriptionTier?: (typeof TIERS)[number];
  @IsOptional()
  @IsIn(VERIFICATION_STATUSES)
  verificationStatus?: (typeof VERIFICATION_STATUSES)[number];
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) coinBalance?: number;
}

export class UpdateMemberDto {
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsEmail() email?: string;
  /** When set, replaces the member's password (admin reset). */
  @IsOptional() @MinLength(8) password?: string;

  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsIn(['MALE', 'FEMALE']) gender?: 'MALE' | 'FEMALE';
  @IsOptional() @IsDateString() birthDate?: string;
  @IsOptional() @IsString() residenceCountry?: string;
  @IsOptional() @IsString() currentCity?: string;
  @IsOptional() @IsString() originCountry?: string;

  @IsOptional() @IsIn(TIERS) subscriptionTier?: (typeof TIERS)[number];
  @IsOptional()
  @IsIn(VERIFICATION_STATUSES)
  verificationStatus?: (typeof VERIFICATION_STATUSES)[number];
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) coinBalance?: number;
}
