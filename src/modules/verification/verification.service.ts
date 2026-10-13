import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { PrivateDocument, PrivateDocumentsService } from './private-documents.service';

export type DocumentKind = 'id' | 'residency';

const REFERRAL_BONUS_COINS = 10;

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly privateDocuments: PrivateDocumentsService,
  ) {}

  async submit(userId: string, dto: SubmitVerificationDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationStatus === 'VERIFIED') {
      throw new BadRequestException('User is already verified');
    }
    if (user.verificationStatus === 'PENDING') {
      throw new BadRequestException('Verification request already pending review');
    }

    // Validate both before moving either, so a bad second URL can't leave the first half-processed.
    this.privateDocuments.parseUploadedUrl(dto.idDocumentUrl);
    if (dto.residencyDocumentUrl) this.privateDocuments.parseUploadedUrl(dto.residencyDocumentUrl);

    if (this.privateDocuments.enabled) {
      user.verificationDocuments = {
        idDocument: await this.privateDocuments.makePrivate(dto.idDocumentUrl),
        residencyDocument: dto.residencyDocumentUrl
          ? await this.privateDocuments.makePrivate(dto.residencyDocumentUrl)
          : undefined,
        submittedAt: new Date(),
      };
    } else {
      user.verificationDocuments = {
        idDocumentUrl: dto.idDocumentUrl,
        residencyDocumentUrl: dto.residencyDocumentUrl,
        submittedAt: new Date(),
      };
    }
    user.verificationStatus = 'PENDING';
    await user.save();
    return this.getMyStatus(userId);
  }

  async getMyStatus(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('isVerified verificationStatus verificationDocuments.rejectionReason verificationDocuments.submittedAt');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Pending requests with only which documents exist — admins open them via getDocument(). */
  async listPending() {
    const users = await this.userModel
      .find({ verificationStatus: 'PENDING' })
      .select('phoneNumber profile.firstName verificationDocuments');
    return users.map((user) => {
      const docs = user.verificationDocuments;
      return {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        profile: { firstName: user.profile.firstName },
        verificationDocuments: {
          hasIdDocument: !!(docs?.idDocument || docs?.idDocumentUrl),
          hasResidencyDocument: !!(docs?.residencyDocument || docs?.residencyDocumentUrl),
          submittedAt: docs?.submittedAt,
        },
      };
    });
  }

  /** Streams one of a member's documents to an admin, whether stored privately or (legacy) publicly. */
  async getDocument(userId: string, kind: DocumentKind) {
    const user = await this.userModel.findById(userId).select('verificationDocuments');
    const docs = user?.verificationDocuments;
    const privateDoc = kind === 'id' ? docs?.idDocument : docs?.residencyDocument;
    const legacyUrl = kind === 'id' ? docs?.idDocumentUrl : docs?.residencyDocumentUrl;

    let doc: PrivateDocument;
    if (privateDoc) {
      doc = privateDoc;
    } else if (legacyUrl) {
      // Only ever fetch from our own Cloudinary account, never an arbitrary stored URL.
      this.privateDocuments.parseUploadedUrl(legacyUrl);
      const res = await fetch(legacyUrl);
      if (!res.ok) throw new NotFoundException('Document not found');
      return { contentType: res.headers.get('content-type') ?? 'image/jpeg', body: Buffer.from(await res.arrayBuffer()) };
    } else {
      throw new NotFoundException('Document not found');
    }
    return this.privateDocuments.fetch(doc);
  }

  async approve(userId: string) {
    const user = await this.findPending(userId);
    user.verificationStatus = 'VERIFIED';
    user.isVerified = true;
    if (user.verificationDocuments) user.verificationDocuments.rejectionReason = undefined;

    // Referral reward fires exactly once: approve() only ever runs on a PENDING
    // user (guarded by findPending), and a user can never return to PENDING
    // after being VERIFIED, so this can't double-credit on a later re-approval.
    if (user.referredBy) {
      user.coinBalance += REFERRAL_BONUS_COINS;
      await this.userModel.updateOne({ _id: user.referredBy }, { $inc: { coinBalance: REFERRAL_BONUS_COINS } });
    }

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
