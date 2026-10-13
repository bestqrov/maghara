import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrivateDocumentsService } from './private-documents.service';
import { VerificationService } from './verification.service';

const ID_URL = 'https://res.cloudinary.com/dysrmslea/image/upload/v1712345/zawaj/verification/id123.jpg';
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
    return { service: new VerificationService(userModel as any, docs), user, makePrivate };
  }

  it('stores private references instead of public URLs', async () => {
    const { service, user, makePrivate } = setup(true);
    await service.submit('u1', { idDocumentUrl: ID_URL, residencyDocumentUrl: RES_URL });

    expect(makePrivate).toHaveBeenCalledTimes(2);
    expect(user.verificationDocuments.idDocument).toEqual({ publicId: 'zawaj/verification/id123', format: 'jpg' });
    expect(user.verificationDocuments.residencyDocument).toEqual({ publicId: 'zawaj/verification/res456', format: 'png' });
    expect(user.verificationDocuments.idDocumentUrl).toBeUndefined();
    expect(user.verificationStatus).toBe('PENDING');
  });

  it('rejects a foreign URL before touching anything', async () => {
    const { service, user, makePrivate } = setup(true);
    await expect(
      service.submit('u1', { idDocumentUrl: ID_URL, residencyDocumentUrl: 'https://evil.example/x.jpg' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(makePrivate).not.toHaveBeenCalled();
    expect(user.save).not.toHaveBeenCalled();
  });

  it('falls back to the public URL when Cloudinary credentials are missing', async () => {
    const { service, user, makePrivate } = setup(false);
    await service.submit('u1', { idDocumentUrl: ID_URL });
    expect(makePrivate).not.toHaveBeenCalled();
    expect(user.verificationDocuments.idDocumentUrl).toBe(ID_URL);
  });
});
