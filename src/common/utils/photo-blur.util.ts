import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

// Heavy blur applied by Cloudinary at delivery time, on a small low-quality
// rendition, so the teaser image carries no usable detail.
const BLUR_TRANSFORMATION = 'e_blur:2000,w_300,q_30';

export const BLURRED_PHOTO_ROUTE = 'public/blurred-photo';

/**
 * Returns the server-blurred Cloudinary rendition of `url`, or null when the
 * photo is not hosted on Cloudinary (it cannot be blurred server-side, so it
 * must not be sent at all).
 *
 * This URL is only ever fetched by our own server: it embeds the original's
 * public ID, so handing it to a client would let them strip the transformation
 * and load the unblurred original.
 */
export function toBlurredPhotoUrl(url: string): string | null {
  const match = CLOUDINARY_UPLOAD_URL.exec(url);
  if (!match) return null;
  return `${match[1]}${BLUR_TRANSFORMATION}/${match[2]}`;
}

function tokenKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return createHash('sha256').update(`blurred-photo:${secret}`).digest();
}

/** Encrypts a photo URL into an opaque token that reveals nothing about the original. */
export function encryptPhotoToken(url: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', tokenKey(), iv);
  const encrypted = Buffer.concat([cipher.update(url, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

/** Returns the photo URL a token was made from, or null if it is malformed or forged. */
export function decryptPhotoToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64url');
    if (raw.length < 29) return null;
    const decipher = createDecipheriv('aes-256-gcm', tokenKey(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

/**
 * Reduces a profile to what a locked (blurred) search teaser may reveal:
 * only a blurred cover photo and non-identifying fields. The name, job and
 * bio are withheld server-side instead of just hidden by the client, and the
 * cover is served through our own proxy (`apiBaseUrl`) so the Cloudinary
 * public ID of the original never reaches the client.
 */
export function toTeaserProfile<T extends Record<string, any>>(profile: T, apiBaseUrl: string) {
  const original = profile.photos?.[0];
  const cover =
    original && toBlurredPhotoUrl(original) ? `${apiBaseUrl}/${BLURRED_PHOTO_ROUTE}/${encryptPhotoToken(original)}` : null;
  return {
    firstName: '',
    gender: profile.gender,
    birthDate: profile.birthDate,
    residenceCountry: profile.residenceCountry,
    currentCity: profile.currentCity,
    originCountry: profile.originCountry,
    relocationPreference: profile.relocationPreference,
    photos: cover ? [cover] : [],
  };
}
