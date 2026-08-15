import { IsDateString, IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() phoneNumber: string;
  @IsOptional() @IsString() email?: string;
  @MinLength(8) password: string;

  @IsString() firstName: string;
  @IsIn(['MALE', 'FEMALE']) gender: 'MALE' | 'FEMALE';
  @IsDateString() birthDate: string;
  @IsString() residenceCountry: string;
  @IsString() currentCity: string;
  @IsString() originCountry: string;

  /** Referrer's own referralCode, e.g. from a /register?ref=CODE link. Unknown/invalid codes are ignored, never block signup. */
  @IsOptional() @IsString() referralCode?: string;
}
