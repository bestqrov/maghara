import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class CryptoWalletsDto {
  @IsOptional() @IsString() trc20?: string;
  @IsOptional() @IsString() polygon?: string;
  @IsOptional() @IsString() solana?: string;
}

class BankTransferDetailsDto {
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() accountHolder?: string;
  @IsOptional() @IsString() rib?: string;
}

class CashPlusDetailsDto {
  @IsOptional() @IsString() code?: string;
}

class InternationalWireDetailsDto {
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() accountHolder?: string;
  @IsOptional() @IsString() iban?: string;
  @IsOptional() @IsString() swiftBic?: string;
  @IsOptional() @IsString() bankAddress?: string;
}

export class UpdatePaymentSettingsDto {
  @IsOptional() @ValidateNested() @Type(() => CryptoWalletsDto) cryptoWallets?: CryptoWalletsDto;
  @IsOptional() @ValidateNested() @Type(() => BankTransferDetailsDto) bankTransfer?: BankTransferDetailsDto;
  @IsOptional() @ValidateNested() @Type(() => CashPlusDetailsDto) cashPlus?: CashPlusDetailsDto;
  @IsOptional() @ValidateNested() @Type(() => InternationalWireDetailsDto) internationalWire?: InternationalWireDetailsDto;
}
