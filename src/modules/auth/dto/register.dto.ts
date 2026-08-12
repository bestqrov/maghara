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
}
