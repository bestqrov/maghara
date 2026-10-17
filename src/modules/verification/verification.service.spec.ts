import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrivateDocumentsService } from './private-documents.service';
import { VerificationService } from './verification.service';
import { FaceMatchService } from './face-match.service';

const ID_URL = 'https://res.cloudinary.com/dysrmslea/image/upload/v1712345/zawaj/verification/id123.jpg';
const SELFIE_URL = 'https://res.cloudinary.com/dysrmslea/image/upload/v1712345/zawaj/verification/selfie789.jpg';
const RES_URL = 'https://res.cloudinary.com/dysrmslea/image/upload/v1712345/zawaj/verification/res456.png';

function privateDocs(enabled: boolean) {
  const env: Record<string, string> = enabled ? { CLOUDINARY_API_KEY: 'k', CLOUDINARY_API_SECRET: 's' } : {};
  return new PrivateDocumentsService({ get: (key: string) => env[key] } as unknown as ConfigService);
}

describe('PrivateDocumentsService', () => {
  it('parses our own uploaded image URLs', () => {
    expect(privateDocs(false).parseUploadedUrl(ID_URL)).toEqual({ publicId: 'zawaj/verification/id123', format: 'jpg' });
  });

  it('rejects other accounts and non-Cloudinary URLs', () => {
    const service = privateDocs(false);
    expect(() => service.parseUploadedUrl('https://res.cloudinary.com/other/image/upload/v1/a.jpg')).toThrow(BadRequestException);
    expect(() => service.parseUploadedUrl('http://169.254.169.254/latest/meta-data')).toThrow(BadRequestException);
  });

  it('moves the asset to authenticated storage and purges the public copy', async () => {
    const rename = jest.spyOn(cloudinary.uploader, 'rename').mockResolvedValue({} as never);
    await expect(privateDocs(true).makePrivate(ID_URL)).resolves.toEqual({
      publicId: 'zawaj/verification/id123',
      format: 'jpg',
    });
    expect(rename).toHaveBeenCalledWith('zawaj/verification/id123', 'zawaj/verification/id123', {
      type: 'upload',
      to_type: 'authenticated',
      invalidate: true,
      overwrite: true,
    });
    rename.mockRestore();
  });
});

describe('VerificationService.submit', () => {
  function setup(enabled: boolean) {
    const user: Record<string, any> = { verificationStatus: 'UNVERIFIED', save: jest.fn() };
    const select = jest.fn().mockResolvedValue({ verificationStatus: 'PENDING' });
    const userModel = { findById: jest.fn().mockReturnValueOnce(Promise.resolve(user)).mockReturnValue({ select }) };
    const docs = privateDocs(enabled);
    const makePrivate = jest.spyOn(docs, 'makePrivate').mockImplementation(async (url) => docs.parseUploadedUrl(url));
    const service = new VerificationService(userModel as any, docs, new FaceMatchService());
    // The face check runs in the background; it is covered separately below.
    jest.spyOn(service, 'checkFaces').mockResolvedValue(undefined);
    return { service, user, makePrivate };
  }

  it('stores the document, selfie and residency paper as private references', async () => {
    const { service, user, makePrivate } = setup(true);
    await service.submit('u1', {
      documentType: 'PASSPORT',
      idDocumentUrl: ID_URL,
      selfieUrl: SELFIE_URL,
      residencyDocumentUrl: RES_URL,
    });

    expect(makePrivate).toHaveBeenCalledTimes(3);
    expect(user.verificationDocuments.documentType).toBe('PASSPORT');
    expect(user.verificationDocuments.idDocument).toEqual({ publicId: 'zawaj/verification/id123', format: 'jpg' });
    expect(user.verificationDocuments.selfie).toEqual({ publicId: 'zawaj/verification/selfie789', format: 'jpg' });
    expect(user.verificationDocuments.residencyDocument).toEqual({ publicId: 'zawaj/verification/res456', format: 'png' });
    expect(user.verificationDocuments.idDocumentUrl).toBeUndefined();
    expect(user.verificationStatus).toBe('PENDING');
    expect(service.checkFaces).toHaveBeenCalledWith('u1');
  });

  it('rejects a foreign selfie URL before touching anything', async () => {
    const { service, user, makePrivate } = setup(true);
    await expect(
      service.submit('u1', { documentType: 'ID_CARD', idDocumentUrl: ID_URL, selfieUrl: 'https://evil.example/x.jpg' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(makePrivate).not.toHaveBeenCalled();
    expect(user.save).not.toHaveBeenCalled();
  });

  it('falls back to public URLs when Cloudinary credentials are missing', async () => {
    const { service, user, makePrivate } = setup(false);
    await service.submit('u1', { documentType: 'ID_CARD', idDocumentUrl: ID_URL, selfieUrl: SELFIE_URL });
    expect(makePrivate).not.toHaveBeenCalled();
    expect(user.verificationDocuments.idDocumentUrl).toBe(ID_URL);
    expect(user.verificationDocuments.selfieUrl).toBe(SELFIE_URL);
  });
});

describe('VerificationService.checkFaces', () => {
  function setup(comparison: Record<string, any>) {
    const user: Record<string, any> = {
      verificationStatus: 'PENDING',
      isVerified: false,
      profile: { photos: [] },
      verificationDocuments: { idDocumentUrl: ID_URL, selfieUrl: SELFIE_URL },
      save: jest.fn(),
    };
    const userModel = { findById: jest.fn().mockResolvedValue(user) };
    const faceMatch = new FaceMatchService();
    jest.spyOn(faceMatch, 'compare').mockResolvedValue(comparison as any);
    const service = new VerificationService(userModel as any, privateDocs(false), faceMatch);
    jest.spyOn(service, 'getDocument').mockResolvedValue({ contentType: 'image/jpeg', body: Buffer.from('x') });
    return { service, user };
  }

  it('records a match and leaves the decision to an admin', async () => {
    const { service, user } = setup({ documentFaces: 1, selfieFaces: 1, distance: 0.38, profileDistance: 0.41 });
    await service.checkFaces('u1');
    expect(user.verificationDocuments.faceMatch).toMatchObject({ status: 'MATCH', distance: 0.38, profileDistance: 0.41 });
    expect(user.verificationStatus).toBe('PENDING');
    expect(user.save).toHaveBeenCalled();
  });

  it('flags faces that do not match, still for an admin to decide', async () => {
    const { service, user } = setup({ documentFaces: 1, selfieFaces: 1, distance: 0.82, profileDistance: null });
    await service.checkFaces('u1');
    expect(user.verificationDocuments.faceMatch.status).toBe('NO_MATCH');
    expect(user.verificationStatus).toBe('PENDING');
  });

  it('rejects right away when the selfie shows no face, so the member can retake it', async () => {
    const { service, user } = setup({ documentFaces: 1, selfieFaces: 0, distance: null, profileDistance: null });
    await service.checkFaces('u1');
    expect(user.verificationDocuments.faceMatch.status).toBe('NO_FACE_SELFIE');
    expect(user.verificationStatus).toBe('REJECTED');
    expect(user.verificationDocuments.rejectionReason).toMatch(/selfie/);
  });

  it('records an error instead of failing when the photos cannot be read', async () => {
    const { service, user } = setup({});
    jest.spyOn(service, 'getDocument').mockRejectedValue(new Error('cloudinary down'));
    await service.checkFaces('u1');
    expect(user.verificationDocuments.faceMatch.status).toBe('ERROR');
    expect(user.verificationStatus).toBe('PENDING');
  });
});
