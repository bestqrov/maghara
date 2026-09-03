import { IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsString() password: string;
}

export class ChangeAdminPasswordDto {
  @IsString() currentPassword: string;
  @IsString() @MinLength(8) newPassword: string;
}
