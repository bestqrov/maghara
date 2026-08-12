import { BlurredImage } from './BlurredImage';
import { ShieldCheckIcon } from './icons';
import { SearchResultProfile } from '@/services/matching.service';

function calculateAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

interface ProfileCardProps {
  result: SearchResultProfile;
  onSendInterest: (id: string) => void;
  sending: boolean;
  sent: boolean;
}

export function ProfileCard({ result, onSendInterest, sending, sent }: ProfileCardProps) {
  const { profile } = result;
  const photo = profile.photos[0] ?? 'https://placehold.co/400x500/eef6f0/2f7a52?text=Zawaj';

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <BlurredImage
        src={photo}
        alt={profile.firstName}
        isBlurred={result.blurred}
        className="aspect-[4/5] w-full"
        lockLabel="فتح بالنقط أو VIP"
      />
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-emerald-900">
            {result.blurred ? '••••••' : profile.firstName}, {calculateAge(profile.birthDate)}
          </h3>
          {result.isVerified && <ShieldCheckIcon className="h-4 w-4 text-gold-600" />}
        </div>
        <p className="text-xs text-ink-500">
          {profile.currentCity} · {profile.residenceCountry}
        </p>
        {profile.jobTitle && !result.blurred && <p className="text-xs text-ink-500">{profile.jobTitle}</p>}

        <button
          type="button"
          disabled={result.blurred || sending || sent}
          onClick={() => onSendInterest(result._id)}
          className="mt-3 rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-emerald-100 disabled:text-emerald-400"
        >
          {sent ? 'تم الإرسال ✓' : 'إبعث اهتمام'}
        </button>
      </div>
    </div>
  );
}
