import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber() @Min(0) amount: number;
  @IsOptional() @IsString() currency?: string;

  @IsIn(['CRYPTO_TRC20', 'CRYPTO_POLYGON', 'CRYPTO_SOLANA', 'BANK_TRANSFER', 'CASH_PLUS', 'INTERNATIONAL_WIRE'])
  paymentMethod:
    | 'CRYPTO_TRC20'
    | 'CRYPTO_POLYGON'
    | 'CRYPTO_SOLANA'
    | 'BANK_TRANSFER'
    | 'CASH_PLUS'
    | 'INTERNATIONAL_WIRE';

  @IsIn(['COIN_PURCHASE', 'VIP_SUBSCRIPTION', 'VERIFICATION_FEE'])
  type: 'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE';

  @IsOptional() @IsString() txHashOrReceipt?: string;
}
