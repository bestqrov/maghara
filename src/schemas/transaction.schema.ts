import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PaymentMethod =
  | 'CRYPTO_TRC20'
  | 'CRYPTO_POLYGON'
  | 'CRYPTO_SOLANA'
  | 'BANK_TRANSFER'
  | 'CASH_PLUS'
  | 'INTERNATIONAL_WIRE';
export type TransactionType = 'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true }) amount: number;
  @Prop({ default: 'USDT' }) currency: string;

  @Prop({
    enum: ['CRYPTO_TRC20', 'CRYPTO_POLYGON', 'CRYPTO_SOLANA', 'BANK_TRANSFER', 'CASH_PLUS', 'INTERNATIONAL_WIRE'],
    required: true,
  })
  paymentMethod: PaymentMethod;

  @Prop() txHashOrReceipt?: string;

  @Prop({ enum: ['COIN_PURCHASE', 'VIP_SUBSCRIPTION', 'VERIFICATION_FEE'], required: true })
  type: TransactionType;

  @Prop({ enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
