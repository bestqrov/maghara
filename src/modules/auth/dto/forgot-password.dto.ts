import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail() email: string;
  /** Site language the reset link should open in. */
  @IsOptional() @IsIn(['ar', 'fr', 'en', 'es']) locale?: 'ar' | 'fr' | 'en' | 'es';
}
