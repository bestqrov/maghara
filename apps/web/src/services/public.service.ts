const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface PublicPreviewProfile {
  firstName: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  currentCity: string;
  residenceCountry: string;
  isVerified: true;
}

interface PublicProfilesParams {
  city?: string | null;
  country?: string;
  limit?: number;
}

export async function getPublicPreviewProfiles(params: PublicProfilesParams) {
  const query = new URLSearchParams();
  if (params.city) query.set('city', params.city);
  if (params.country) query.set('country', params.country);
  query.set('limit', String(params.limit ?? 6));

  try {
    const res = await fetch(`${API_URL}/public/profiles?${query.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as PublicPreviewProfile[];
  } catch {
    return [];
  }
}
