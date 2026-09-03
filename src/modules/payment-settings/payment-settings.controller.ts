import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PaymentSettingsService } from './payment-settings.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';

@Controller('payment-settings')
export class PaymentSettingsController {
  constructor(private readonly paymentSettingsService: PaymentSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get() {
    return this.paymentSettingsService.get();
  }

  @UseGuards(AdminJwtGuard)
  @Patch()
  update(@Body() dto: UpdatePaymentSettingsDto) {
    return this.paymentSettingsService.update(dto);
  }
}
