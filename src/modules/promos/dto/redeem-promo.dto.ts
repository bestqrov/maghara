import { IsString, MinLength } from 'class-validator';

export class RedeemPromoDto {
  @IsString() @MinLength(3) code: string;
}
