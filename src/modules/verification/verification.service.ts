import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { SubmitVerificationDto } from './dto/submit-verification.dto';

@Injectable()
export class VerificationService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async submit(userId: string, dto: SubmitVerificationDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationStatus === 'VERIFIED') {
      throw new BadRequestException('User is already verified');
    }
    if (user.verificationStatus === 'PENDING') {
      throw new BadRequestException('Verification request already pending review');
    }

    user.verificationDocuments = {
      idDocumentUrl: dto.idDocumentUrl,
      residencyDocumentUrl: dto.residencyDocumentUrl,
      submittedAt: new Date(),
    };
    user.verificationStatus = 'PENDING';
    await user.save();
    return this.getMyStatus(userId);
  }

  async getMyStatus(userId: string) {
    const user = await this.userModel.findById(userId).select('isVerified verificationStatus verificationDocuments');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async listPending() {
    return this.userModel
      .find({ verificationStatus: 'PENDING' })
      .select('phoneNumber profile.firstName verificationDocuments');
  }

  async approve(userId: string) {
    const user = await this.findPending(userId);
    user.verificationStatus = 'VERIFIED';
    user.isVerified = true;
    if (user.verificationDocuments) user.verificationDocuments.rejectionReason = undefined;
    await user.save();
    return this.getMyStatus(userId);
  }

  async reject(userId: string, reason?: string) {
    const user = await this.findPending(userId);
    user.verificationStatus = 'REJECTED';
    user.isVerified = false;
    if (user.verificationDocuments) user.verificationDocuments.rejectionReason = reason;
    await user.save();
    return this.getMyStatus(userId);
  }

  private async findPending(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.verificationStatus !== 'PENDING') {
      throw new BadRequestException('User has no pending verification request');
    }
    return user;
  }
}
