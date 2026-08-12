import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../../schemas/transaction.schema';
import { User } from '../../schemas/user.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

const CRYPTO_METHODS = new Set(['CRYPTO_TRC20', 'CRYPTO_POLYGON', 'CRYPTO_SOLANA']);

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    if (CRYPTO_METHODS.has(dto.paymentMethod) && !dto.txHashOrReceipt) {
      throw new BadRequestException('txHash is required for crypto payments');
    }
    if (!CRYPTO_METHODS.has(dto.paymentMethod) && !dto.txHashOrReceipt) {
      throw new BadRequestException('Receipt reference is required for manual payments');
    }

    return this.transactionModel.create({
      userId,
      amount: dto.amount,
      currency: dto.currency ?? 'USDT',
      paymentMethod: dto.paymentMethod,
      type: dto.type,
      txHashOrReceipt: dto.txHashOrReceipt,
      status: 'PENDING',
    });
  }

  async getMyTransactions(userId: string) {
    return this.transactionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async listPending() {
    return this.transactionModel.find({ status: 'PENDING' }).sort({ createdAt: 1 });
  }

  async review(transactionId: string, approve: boolean) {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Transaction has already been reviewed');
    }

    transaction.status = approve ? 'SUCCESS' : 'FAILED';
    await transaction.save();

    if (approve) {
      await this.applyTransactionEffect(transaction);
    }

    return transaction;
  }

  private async applyTransactionEffect(transaction: Transaction) {
    const user = await this.userModel.findById(transaction.userId);
    if (!user) return;

    switch (transaction.type) {
      case 'COIN_PURCHASE':
        user.coinBalance += transaction.amount;
        break;
      case 'VIP_SUBSCRIPTION':
        user.subscriptionTier = 'VIP';
        break;
      case 'VERIFICATION_FEE':
        user.verificationStatus = 'PENDING';
        break;
    }

    await user.save();
  }
}
