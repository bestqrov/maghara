import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import type { PromoCodeType } from '../../../schemas/promo-code.schema';

export class CreatePromoDto {
  @IsString() @MinLength(3) code: string;

  @IsIn(['VIP_DAYS', 'COINS', 'CROSS_BORDER_ACCESS']) type: PromoCodeType;

  @IsInt() @Min(0) rewardValue: number;

  @IsInt() @Min(1) maxRedemptions: number;

  @IsOptional() @IsBoolean() requiresVerification?: boolean;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
