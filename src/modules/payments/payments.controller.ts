import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('transactions')
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateTransactionDto) {
    return this.paymentsService.createTransaction(user.userId, dto);
  }

  @Get('transactions/me')
  getMine(@CurrentUser() user: { userId: string }) {
    return this.paymentsService.getMyTransactions(user.userId);
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/transactions/pending')
  listPending() {
    return this.paymentsService.listPending();
  }

  @UseGuards(AdminJwtGuard)
  @Post('admin/transactions/:transactionId/approve')
  approve(@Param('transactionId') transactionId: string) {
    return this.paymentsService.review(transactionId, true);
  }

  @UseGuards(AdminJwtGuard)
  @Post('admin/transactions/:transactionId/reject')
  reject(@Param('transactionId') transactionId: string) {
    return this.paymentsService.review(transactionId, false);
  }
}
