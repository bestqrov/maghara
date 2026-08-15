import { LockClosedIcon, ShieldCheckIcon } from '@/components/icons';
import type { PublicPreviewProfile } from '@/services/public.service';
import type { Locale } from '@/lib/seo';

const UNLOCK_LABEL: Record<Locale, string> = {
  ar: 'سجّل لعرض الصورة',
  fr: 'Inscrivez-vous pour voir la photo',
  en: 'Sign up to see the photo',
  es: 'Regístrate para ver la foto',
};

interface SeoProfileCardProps {
  profile: PublicPreviewProfile;
  locale: Locale;
  /**
   * The DB only stores city/country names in Arabic (no per-locale
   * translations for user location data). On a "city" page every result
   * shares the exact same city we already searched for, so we can safely
   * swap in the page's own translated name instead of the raw Arabic value.
   * On "diaspora" pages only the country is guaranteed to match — the
   * member's specific city stays untranslated.
   */
  locationLabel: string;
}

export function SeoProfileCard({ profile, locale, locationLabel }: SeoProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div
        className="relative flex aspect-[3/4] items-center justify-center"
        style={{
          background:
            profile.gender === 'FEMALE'
              ? 'linear-gradient(160deg, var(--color-rose-100) 0%, var(--color-rose-50) 100%)'
              : 'linear-gradient(160deg, var(--color-blue-100) 0%, var(--color-blue-50) 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <LockClosedIcon className="h-8 w-8 text-blue-900/40" />
          <span className="px-3 text-xs font-semibold text-blue-900/50">{UNLOCK_LABEL[locale]}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-base font-bold text-blue-900">
            {profile.firstName}, {profile.age}
          </h3>
          <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
        </div>
        <p className="mt-1 text-xs text-ink-500">{locationLabel}</p>
      </div>
    </div>
  );
}
