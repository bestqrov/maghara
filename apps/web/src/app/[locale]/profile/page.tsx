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
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <h1 className="text-xl font-bold text-emerald-700">{dict.profile.title}</h1>

      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-ink-500">{dict.profile.subtitle}</p>

        {ready && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <ImageUploader
              label={dict.profile.photoLabel}
              value={photoUrl}
              onUploaded={setPhotoUrl}
              folder="zawaj/profiles"
            />
            <Input
              id="firstName"
              label={dict.profile.firstNameLabel}
              {...register('firstName', { required: true })}
              error={errors.firstName ? dict.common.errorGeneric : undefined}
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
            <Input id="jobTitle" label={dict.profile.jobTitleLabel} {...register('jobTitle')} />
            <Input id="bio" label={dict.profile.bioLabel} {...register('bio')} />

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            {success && <p className="text-sm text-emerald-600">{dict.profile.success}</p>}

            <Button type="submit" loading={loading} className="mt-2 w-full">
              {dict.profile.save}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
