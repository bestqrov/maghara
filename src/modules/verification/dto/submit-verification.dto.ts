import { IsOptional, IsString, IsUrl } from 'class-validator';

export class SubmitVerificationDto {
  @IsUrl() idDocumentUrl: string;
  @IsOptional() @IsUrl() residencyDocumentUrl?: string;
}

export class RejectVerificationDto {
  @IsOptional() @IsString() reason?: string;
}
