const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

// Heavy blur applied by Cloudinary at delivery time, on a small low-quality
// rendition, so the teaser image carries no usable detail.
const BLUR_TRANSFORMATION = 'e_blur:2000,w_300,q_30';

/**
 * Returns a server-blurred Cloudinary rendition of `url`, or null when the
 * photo is not hosted on Cloudinary (it cannot be blurred server-side, so it
 * must not be sent at all).
 */
export function toBlurredPhotoUrl(url: string): string | null {
  const match = CLOUDINARY_UPLOAD_URL.exec(url);
  if (!match) return null;
  return `${match[1]}${BLUR_TRANSFORMATION}/${match[2]}`;
}

/**
 * Reduces a profile to what a locked (blurred) search teaser may reveal:
 * only a blurred cover photo and non-identifying fields. The name, job and
 * bio are withheld server-side instead of just hidden by the client.
 */
export function toTeaserProfile<T extends Record<string, any>>(profile: T) {
  const cover = profile.photos?.[0] ? toBlurredPhotoUrl(profile.photos[0]) : null;
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
