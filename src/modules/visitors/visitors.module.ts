import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileVisitor, ProfileVisitorSchema } from '../../schemas/profile-visitor.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfileVisitor.name, schema: ProfileVisitorSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
