'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { getMe, updateProfile, UpdateProfilePayload } from '@/services/users.service';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { NavBar } from '@/components/NavBar';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { useAppDict, withLocale } from '@/hooks/useLocale';

type ProfileFormFields = Pick<
  UpdateProfilePayload,
  | 'firstName'
  | 'currentCity'
  | 'residenceCountry'
  | 'originCountry'
  | 'relocationPreference'
  | 'jobTitle'
  | 'bio'
>;

export default function ProfilePage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, user, hasHydrated, updateUser } = useAuthStore();
  const [photoUrl, setPhotoUrl] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormFields>();

  useEffect(() => {
    if (hasHydrated && !token) router.replace(withLocale(locale, '/login'));
  }, [token, hasHydrated, router, locale]);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    getMe()
      .then((me) => {
        reset({
          firstName: me.profile.firstName,
          currentCity: me.profile.currentCity,
          residenceCountry: me.profile.residenceCountry,
          originCountry: me.profile.originCountry,
          relocationPreference: me.profile.relocationPreference as ProfileFormFields['relocationPreference'],
          jobTitle: me.profile.jobTitle,
          bio: me.profile.bio,
        });
        setPhotoUrl(me.profile.photos[0] ?? '');
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [hasHydrated, token, reset]);

  async function onSubmit(values: ProfileFormFields) {
    setServerError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        ...values,
        photos: photoUrl ? [photoUrl] : undefined,
      });
      if (user) updateUser({ ...user, ...updatedUser });
      setSuccess(true);
    } catch (err) {
      const detail = isAxiosError(err)
        ? err.response
          ? `status ${err.response.status}: ${JSON.stringify(err.response.data)}`
          : `network error: ${err.message}`
        : String(err);
      setServerError(`${dict.profile.errorGeneric} [${detail}]`);
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated || !token) return null;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(60% 40% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
      }}
    >
      <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-0 h-[520px] w-[520px] -translate-y-1/3 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
        <NavBar />

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <WeddingEmblem className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-rose-500 opacity-[0.06] sm:h-56 sm:w-56" />

          <div className="relative flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-12 w-auto" />
            <h1 className="font-display text-2xl font-bold text-blue-900">{dict.profile.title}</h1>
            <p className="max-w-sm text-sm text-ink-500">{dict.profile.subtitle}</p>
          </div>

          {ready && (
            <form onSubmit={handleSubmit(onSubmit)} className="relative mt-8 flex flex-col gap-5">
              <div className="flex justify-center">
                <ImageUploader
                  label={dict.profile.photoLabel}
                  value={photoUrl}
                  onUploaded={setPhotoUrl}
                  folder="zawaj/profiles"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="firstName"
                  label={dict.profile.firstNameLabel}
                  {...register('firstName', { required: true })}
                  error={errors.firstName ? dict.common.errorGeneric : undefined}
                />
                <Input
                  id="jobTitle"
                  label={dict.profile.jobTitleLabel}
                  {...register('jobTitle')}
                />
                <Input
                  id="residenceCountry"
                  label={dict.profile.residenceCountryLabel}
                  {...register('residenceCountry', { required: true })}
                  error={errors.residenceCountry ? dict.common.errorGeneric : undefined}
                />
                <Input
                  id="currentCity"
                  label={dict.profile.currentCityLabel}
                  {...register('currentCity', { required: true })}
                  error={errors.currentCity ? dict.common.errorGeneric : undefined}
                />
                <Input
                  id="originCountry"
                  label={dict.profile.originCountryLabel}
                  {...register('originCountry', { required: true })}
                  error={errors.originCountry ? dict.common.errorGeneric : undefined}
                />
                <Select
                  id="relocationPreference"
                  label={dict.profile.relocationLabel}
                  {...register('relocationPreference')}
                  options={[
                    { value: 'OPEN_TO_MOVE', label: dict.profile.relocationOpen },
                    { value: 'LOOKING_FOR_EXPAT', label: dict.profile.relocationExpat },
                    { value: 'LOCAL_ONLY', label: dict.profile.relocationLocal },
                  ]}
                />
              </div>

              <Input id="bio" label={dict.profile.bioLabel} {...register('bio')} />

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              {success && <p className="text-sm text-emerald-600">{dict.profile.success}</p>}

              <Button type="submit" loading={loading} className="mt-2 w-full sm:w-auto sm:self-center sm:px-10">
                {dict.profile.save}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
