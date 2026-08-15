'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { register as registerUser, RegisterPayload } from '@/services/auth.service';
import { updateProfile } from '@/services/users.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/StepIndicator';
import { ImageUploader } from '@/components/ImageUploader';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { LocaleLink } from '@/components/LocaleLink';
import { useAppDict, withLocale } from '@/hooks/useLocale';

type WizardFields = RegisterPayload & {
  relocationPreference: 'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY';
  jobTitle?: string;
  bio?: string;
};

const STEP_FIELDS: (keyof WizardFields)[][] = [
  ['phoneNumber', 'password'],
  ['firstName', 'gender', 'birthDate'],
  ['residenceCountry', 'currentCity', 'originCountry'],
  ['relocationPreference', 'jobTitle', 'bio'],
  [],
];

const TOTAL_STEPS = STEP_FIELDS.length;

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') ?? undefined;
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState(0);
  const [photoUrl, setPhotoUrl] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<WizardFields>({
    defaultValues: { gender: 'MALE', relocationPreference: 'OPEN_TO_MOVE' },
  });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: WizardFields) {
    setServerError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await registerUser({
        phoneNumber: values.phoneNumber,
        password: values.password,
        firstName: values.firstName,
        gender: values.gender,
        birthDate: values.birthDate,
        residenceCountry: values.residenceCountry,
        currentCity: values.currentCity,
        originCountry: values.originCountry,
        referralCode,
      });
      setSession(accessToken, user);

      const updatedUser = await updateProfile({
        relocationPreference: values.relocationPreference,
        jobTitle: values.jobTitle,
        bio: values.bio,
        photos: photoUrl ? [photoUrl] : undefined,
      });
      setSession(accessToken, updatedUser);

      router.push(withLocale(locale, '/verification'));
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setServerError(dict.register.errorPhoneTaken);
      } else {
        setServerError(dict.common.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background: 'radial-gradient(60% 55% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
      }}
    >
      <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-1/3 h-[520px] w-[520px] -translate-y-1/2 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

      <div className="relative w-full max-w-sm rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-icon.png" alt="" className="mx-auto h-14 w-auto" />
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-blue-900">{dict.register.title}</h1>
        <p className="mt-1 text-center text-sm text-ink-500">{dict.register.stepOf(step + 1, TOTAL_STEPS)}</p>

        <div className="mt-4">
          <StepIndicator total={TOTAL_STEPS} current={step} />
        </div>

        <form
          onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
          className="mt-8 flex flex-col gap-4"
        >
          {step === 0 && (
            <>
              <Input
                id="phoneNumber"
                label={dict.register.phoneLabel}
                placeholder={dict.register.phonePlaceholder}
                {...register('phoneNumber', { required: dict.register.phoneRequired })}
                error={errors.phoneNumber?.message}
              />
              <Input
                id="password"
                label={dict.register.passwordLabel}
                type="password"
                {...register('password', {
                  required: dict.register.passwordRequired,
                  minLength: { value: 8, message: dict.register.passwordMinLength },
                })}
                error={errors.password?.message}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Input
                id="firstName"
                label={dict.register.firstNameLabel}
                {...register('firstName', { required: dict.register.firstNameRequired })}
                error={errors.firstName?.message}
              />
              <Select
                id="gender"
                label={dict.register.genderLabel}
                {...register('gender')}
                options={[
                  { value: 'MALE', label: dict.register.genderMale },
                  { value: 'FEMALE', label: dict.register.genderFemale },
                ]}
              />
              <Input
                id="birthDate"
                label={dict.register.birthDateLabel}
                type="date"
                {...register('birthDate', { required: dict.register.birthDateRequired })}
                error={errors.birthDate?.message}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                id="residenceCountry"
                label={dict.register.residenceCountryLabel}
                placeholder={dict.register.residenceCountryPlaceholder}
                {...register('residenceCountry', { required: dict.register.residenceCountryRequired })}
                error={errors.residenceCountry?.message}
              />
              <Input
                id="currentCity"
                label={dict.register.currentCityLabel}
                {...register('currentCity', { required: dict.register.currentCityRequired })}
                error={errors.currentCity?.message}
              />
              <Input
                id="originCountry"
                label={dict.register.originCountryLabel}
                {...register('originCountry', { required: dict.register.originCountryRequired })}
                error={errors.originCountry?.message}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Select
                id="relocationPreference"
                label={dict.register.relocationLabel}
                {...register('relocationPreference')}
                options={[
                  { value: 'OPEN_TO_MOVE', label: dict.register.relocationOpen },
                  { value: 'LOOKING_FOR_EXPAT', label: dict.register.relocationExpat },
                  { value: 'LOCAL_ONLY', label: dict.register.relocationLocal },
                ]}
              />
              <Input id="jobTitle" label={dict.register.jobTitleLabel} {...register('jobTitle')} />
              <Input id="bio" label={dict.register.bioLabel} {...register('bio')} />
            </>
          )}

          {step === 4 && (
            <ImageUploader label={dict.register.photoLabel} onUploaded={setPhotoUrl} folder="zawaj/profiles" />
          )}

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <div className="mt-2 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={goBack} className="flex-1">
                {dict.register.back}
              </Button>
            )}
            {!isLastStep ? (
              <Button key="next" type="button" onClick={goNext} className="flex-1">
                {dict.register.next}
              </Button>
            ) : (
              <Button key="submit" type="submit" loading={loading} className="flex-1">
                {dict.register.submit}
              </Button>
            )}
          </div>
        </form>

        {step === 0 && (
          <p className="mt-6 text-center text-sm text-ink-500">
            {dict.register.haveAccount}{' '}
            <LocaleLink href="/login" className="font-semibold text-rose-600">
              {dict.register.loginLink}
            </LocaleLink>
          </p>
        )}
      </div>
    </main>
  );
}
