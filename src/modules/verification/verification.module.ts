import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PrivateDocumentsService } from './private-documents.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [VerificationController],
  providers: [VerificationService, PrivateDocumentsService],
})
export class VerificationModule {}
