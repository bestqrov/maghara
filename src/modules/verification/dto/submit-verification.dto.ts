import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class SubmitVerificationDto {
  /** Only a national ID card or a passport is accepted. */
  @IsIn(['ID_CARD', 'PASSPORT']) documentType: 'ID_CARD' | 'PASSPORT';
  @IsUrl() idDocumentUrl: string;
  /** Live selfie taken with the camera. */
  @IsUrl() selfieUrl: string;
  @IsOptional() @IsUrl() residencyDocumentUrl?: string;
}

export class RejectVerificationDto {
  @IsOptional() @IsString() reason?: string;
}
