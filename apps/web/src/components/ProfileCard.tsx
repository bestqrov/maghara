'use client';

import { BlurredImage } from './BlurredImage';
import { ShieldCheckIcon } from './icons';
import { Button } from './ui/Button';
import { SearchResultProfile } from '@/services/matching.service';
import { useAppDict } from '@/hooks/useLocale';

function calculateAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

interface ProfileCardProps {
  result: SearchResultProfile;
  onSendInterest: (id: string) => void;
  onView?: (id: string) => void;
  sending: boolean;
  sent: boolean;
}

export function ProfileCard({ result, onSendInterest, onView, sending, sent }: ProfileCardProps) {
  const { dict } = useAppDict();
  const { profile } = result;
  const photo = profile.photos[0] ?? 'https://placehold.co/400x500/eaf1fa/2c5a96?text=Zawaj';

  return (
    <div
      className="flex flex-col overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm"
      onClick={() => !result.blurred && onView?.(result._id)}
    >
      <BlurredImage
        src={photo}
        alt={profile.firstName}
        isBlurred={result.blurred}
        className="aspect-[4/5] w-full"
        lockLabel={dict.profileCard.lockLabel}
      />
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-bold text-blue-900">
            {result.blurred ? '••••••' : profile.firstName}, {calculateAge(profile.birthDate)}
          </h3>
          {result.isVerified && <ShieldCheckIcon className="h-4 w-4 text-gold-600" />}
        </div>
        <p className="text-xs text-ink-500">
          {profile.currentCity} · {profile.residenceCountry}
        </p>
        {profile.jobTitle && !result.blurred && <p className="text-xs text-ink-500">{profile.jobTitle}</p>}

        <Button
          type="button"
          variant="rose"
          disabled={result.blurred || sending || sent}
          onClick={() => onSendInterest(result._id)}
          className="mt-3 w-full py-2"
        >
          {sent ? dict.profileCard.sent : dict.profileCard.sendInterest}
        </Button>
      </div>
    </div>
  );
}
