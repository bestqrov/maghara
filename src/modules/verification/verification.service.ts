import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FaceMatchResult, User } from '../../schemas/user.schema';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { PrivateDocument, PrivateDocumentsService } from './private-documents.service';
import { FaceMatchService, SAME_PERSON_MAX_DISTANCE, STRONG_MATCH_MAX_DISTANCE } from './face-match.service';

export type DocumentKind = 'id' | 'residency' | 'selfie';

const REFERRAL_BONUS_COINS = 10;
/** Profile photos compared with the selfie, at most. */
const MAX_PROFILE_PHOTOS_COMPARED = 3;

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly privateDocuments: PrivateDocumentsService,
    private readonly faceMatch: FaceMatchService,
  ) {}

  private readonly logger = new Logger(VerificationService.name);

  /** Marks a member verified and pays their referrer's bonus (once ever). Saves the user. */
  private async markVerified(user: User) {
    user.verificationStatus = 'VERIFIED';
    user.isVerified = true;
    if (user.verificationDocuments) user.verificationDocuments.rejectionReason = undefined;

    // Referral reward fires exactly once, even if an admin later un-verifies the
    // member and they get approved again.
    if (user.referredBy && !user.referralBonusPaid) {
      user.referralBonusPaid = true;
      user.coinBalance += REFERRAL_BONUS_COINS;
      await this.userModel.updateOne({ _id: user.referredBy }, { $inc: { coinBalance: REFERRAL_BONUS_COINS } });
    }

    await user.save();
  }

  /**
   * Stores the ID card / passport photo and the live selfie privately, then
   * compares the faces in the background. An admin makes the final call, with
   * the face-match result shown next to the photos.
   */
  async submit(userId: string, dto: SubmitVerificationDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationStatus === 'VERIFIED') {
      throw new BadRequestException('User is already verified');
    }
    if (user.verificationStatus === 'PENDING') {
      throw new BadRequestException('Verification request already pending review');
    }

    // Validate every URL before moving any, so a bad one can't leave the others half-processed.
    this.privateDocuments.parseUploadedUrl(dto.idDocumentUrl);
    this.privateDocuments.parseUploadedUrl(dto.selfieUrl);
    if (dto.residencyDocumentUrl) this.privateDocuments.parseUploadedUrl(dto.residencyDocumentUrl);

    if (this.privateDocuments.enabled) {
      user.verificationDocuments = {
        documentType: dto.documentType,
        idDocument: await this.privateDocuments.makePrivate(dto.idDocumentUrl),
        selfie: await this.privateDocuments.makePrivate(dto.selfieUrl),
        residencyDocument: dto.residencyDocumentUrl
          ? await this.privateDocuments.makePrivate(dto.residencyDocumentUrl)
          : undefined,
        submittedAt: new Date(),
      };
    } else {
      user.verificationDocuments = {
        documentType: dto.documentType,
        idDocumentUrl: dto.idDocumentUrl,
        selfieUrl: dto.selfieUrl,
        residencyDocumentUrl: dto.residencyDocumentUrl,
        submittedAt: new Date(),
      };
    }
    user.verificationStatus = 'PENDING';
    await user.save();

    // A few seconds of work: the member gets their answer now, the result lands on the request.
    this.checkFaces(userId).catch((err) => this.logger.error(`Face check failed for ${userId}: ${err}`));
    return this.getMyStatus(userId);
  }

  /**
   * Compares the selfie with the document's photo and with the profile photos.
   * A selfie or document with no visible face is rejected right away so the
   * member can retake it; everything else waits for an admin.
   */
  async checkFaces(userId: string) {
    const user = await this.userModel.findById(userId);
    const docs = user?.verificationDocuments;
    if (!user || !docs || user.verificationStatus !== 'PENDING') return;

    let result: FaceMatchResult;
    try {
      const [document, selfie] = await Promise.all([this.getDocument(userId, 'id'), this.getDocument(userId, 'selfie')]);
      const profilePhotos = await this.downloadProfilePhotos(user.profile.photos ?? []);
      const comparison = await this.faceMatch.compare(document.body, selfie.body, profilePhotos);
      result = {
        status:
          comparison.selfieFaces === 0
            ? 'NO_FACE_SELFIE'
            : comparison.documentFaces === 0
              ? 'NO_FACE_DOCUMENT'
              : comparison.distance !== null && comparison.distance < SAME_PERSON_MAX_DISTANCE
                ? 'MATCH'
                : 'NO_MATCH',
        distance: comparison.distance ?? undefined,
        profileDistance: comparison.profileDistance ?? undefined,
        checkedAt: new Date(),
      };
    } catch (err) {
      this.logger.error(`Face comparison error for ${userId}: ${err}`);
      result = { status: 'ERROR', checkedAt: new Date() };
    }

    // Re-read: an admin may have decided while the comparison ran.
    const fresh = await this.userModel.findById(userId);
    if (!fresh?.verificationDocuments || fresh.verificationStatus !== 'PENDING') return;
    fresh.verificationDocuments.faceMatch = result;
    if (result.status === 'NO_FACE_SELFIE' || result.status === 'NO_FACE_DOCUMENT') {
      fresh.verificationStatus = 'REJECTED';
      fresh.isVerified = false;
      fresh.verificationDocuments.rejectionReason =
        result.status === 'NO_FACE_SELFIE'
          ? 'No face could be seen in the selfie. Please retake it facing the camera in good light.'
          : 'No face could be seen on the ID card / passport photo. Please retake a clear photo of the whole document.';
    }
    await fresh.save();
  }

  /** The member's own profile photos, only from our Cloudinary account (never an arbitrary stored URL). */
  private async downloadProfilePhotos(urls: string[]) {
    const photos: Buffer[] = [];
    for (const url of urls.slice(0, MAX_PROFILE_PHOTOS_COMPARED)) {
      try {
        this.privateDocuments.parseUploadedUrl(url);
        const res = await fetch(url);
        if (res.ok) photos.push(Buffer.from(await res.arrayBuffer()));
      } catch {
        // skipped: not ours, or unreachable
      }
    }
    return photos;
  }

  async getMyStatus(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('isVerified verificationStatus verificationDocuments.rejectionReason verificationDocuments.submittedAt');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Pending requests with which documents exist and the face-match result — admins open the photos via getDocument(). */
  async listPending() {
    const users = await this.userModel
      .find({ verificationStatus: 'PENDING' })
      .select('phoneNumber profile.firstName verificationDocuments');
    const rows = users.map((user) => {
      const docs = user.verificationDocuments;
      const faceMatch = docs?.faceMatch;
      return {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        profile: { firstName: user.profile.firstName },
        verificationDocuments: {
          documentType: docs?.documentType,
          hasIdDocument: !!(docs?.idDocument || docs?.idDocumentUrl),
          hasSelfie: !!(docs?.selfie || docs?.selfieUrl),
          hasResidencyDocument: !!(docs?.residencyDocument || docs?.residencyDocumentUrl),
          submittedAt: docs?.submittedAt,
          faceMatch: faceMatch
            ? {
                status: faceMatch.status,
                strong: faceMatch.distance !== undefined && faceMatch.distance < STRONG_MATCH_MAX_DISTANCE,
                distance: faceMatch.distance,
                profileMatches:
                  faceMatch.profileDistance === undefined ? null : faceMatch.profileDistance < SAME_PERSON_MAX_DISTANCE,
                profileDistance: faceMatch.profileDistance,
              }
            : null,
        },
      };
    });
    // Closest matches first, so the easy approvals sit on top.
    return rows.sort(
      (a, b) =>
        (a.verificationDocuments.faceMatch?.distance ?? 9) - (b.verificationDocuments.faceMatch?.distance ?? 9),
    );
  }

  /** Streams one of a member's documents to an admin, whether stored privately or (legacy) publicly. */
  async getDocument(userId: string, kind: DocumentKind) {
    const user = await this.userModel.findById(userId).select('verificationDocuments');
    const docs = user?.verificationDocuments;
    const privateDoc = { id: docs?.idDocument, residency: docs?.residencyDocument, selfie: docs?.selfie }[kind];
    const legacyUrl = { id: docs?.idDocumentUrl, residency: docs?.residencyDocumentUrl, selfie: docs?.selfieUrl }[kind];

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
    await this.markVerified(user);
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
