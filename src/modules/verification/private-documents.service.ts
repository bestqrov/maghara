import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

/** A verification document stored as a private ("authenticated") Cloudinary asset. */
export interface PrivateDocument {
  publicId: string;
  format: string;
}

// Delivery URL returned by an (unsigned) client upload:
// https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<format>
const UPLOADED_IMAGE_URL = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)\.([a-z0-9]+)$/i;

/**
 * ID cards and residency papers are uploaded by the clients through the
 * public unsigned preset, which makes them world-readable. On submit, this
 * moves each one to Cloudinary's "authenticated" delivery type (the public URL
 * stops working) and admins then view it only through our API.
 *
 * Needs CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET; without them documents
 * keep their public URL and an error is logged.
 */
@Injectable()
export class PrivateDocumentsService {
  private readonly logger = new Logger(PrivateDocumentsService.name);
  private readonly cloudName: string;
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    this.cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME') ?? 'dysrmslea';
    const apiKey = config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');
    this.enabled = !!(apiKey && apiSecret);
    if (this.enabled) {
      cloudinary.config({ cloud_name: this.cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    } else {
      this.logger.error('CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET not set — verification documents stay publicly readable');
    }
  }

  /** Rejects anything that is not an image uploaded to our own Cloudinary account. */
  parseUploadedUrl(url: string): PrivateDocument {
    const match = UPLOADED_IMAGE_URL.exec(url);
    if (!match || match[1] !== this.cloudName) throw new BadRequestException('Invalid document URL');
    return { publicId: match[2], format: match[3].toLowerCase() };
  }

  /** Moves an uploaded public image to private storage and purges its public CDN copy. */
  async makePrivate(url: string): Promise<PrivateDocument> {
    const doc = this.parseUploadedUrl(url);
    await cloudinary.uploader.rename(doc.publicId, doc.publicId, {
      type: 'upload',
      to_type: 'authenticated',
      invalidate: true,
      overwrite: true,
    });
    return doc;
  }

  /** Downloads a private document's bytes (server-side only; the signed URL never leaves the API). */
  async fetch(doc: PrivateDocument): Promise<{ contentType: string; body: Buffer }> {
    const signedUrl = cloudinary.utils.private_download_url(doc.publicId, doc.format, {
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });
    const res = await fetch(signedUrl);
    if (!res.ok) throw new Error(`Cloudinary download failed: ${res.status}`);
    return {
      contentType: res.headers.get('content-type') ?? `image/${doc.format}`,
      body: Buffer.from(await res.arrayBuffer()),
    };
  }
}
