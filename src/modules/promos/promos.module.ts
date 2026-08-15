import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { PromoCode, PromoCodeSchema } from '../../schemas/promo-code.schema';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
    ]),
  ],
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}
