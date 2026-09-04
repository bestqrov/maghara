import { IsBoolean, IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateSignupCampaignDto {
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() endsAt?: string;
  @IsOptional() @IsInt() @Min(1) vipDays?: number;
}
