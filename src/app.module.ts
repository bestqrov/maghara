import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VerificationModule } from './modules/verification/verification.module';
import { PublicModule } from './modules/public/public.module';
import { PromosModule } from './modules/promos/promos.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';
import { PaymentSettingsModule } from './modules/payment-settings/payment-settings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    RedisModule,
    AuthModule,
    UsersModule,
    VisitorsModule,
    MatchingModule,
    ChatModule,
    PaymentsModule,
    VerificationModule,
    PublicModule,
    PromosModule,
    AdminAuthModule,
    PaymentSettingsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
