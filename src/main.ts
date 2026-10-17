import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // The API sits behind a reverse proxy (TLS terminator). Trusting exactly that
  // many hops makes req.ip the real client IP, so per-IP rate limits apply per
  // member instead of to everyone at once — without letting a client spoof its
  // IP through X-Forwarded-For. Set TRUST_PROXY=0 if the API is ever exposed directly.
  app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
