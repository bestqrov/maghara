'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { register as registerUser, RegisterPayload } from '@/services/auth.service';
import { updateProfile } from '@/services/users.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/StepIndicator';

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
];

const TOTAL_STEPS = STEP_FIELDS.length;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState(0);
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
      });
      setSession(accessToken, user);

      const updatedUser = await updateProfile({
        relocationPreference: values.relocationPreference,
        jobTitle: values.jobTitle,
        bio: values.bio,
      });
      setSession(accessToken, updatedUser);

      router.push('/verification');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setServerError('رقم الهاتف هذا مسجل من قبل');
      } else {
        setServerError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-emerald-700">إنشاء حساب جديد</h1>
        <p className="mt-1 text-center text-sm text-ink-500">خطوة {step + 1} من {TOTAL_STEPS}</p>

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
                label="رقم الهاتف"
                placeholder="+212600000000"
                {...register('phoneNumber', { required: 'خاصك تكتب رقم الهاتف' })}
                error={errors.phoneNumber?.message}
              />
              <Input
                id="password"
                label="الپاسوورد"
                type="password"
                {...register('password', { required: 'خاصك تكتب الپاسوورد', minLength: { value: 8, message: 'خاصو يكون 8 حروف على الأقل' } })}
                error={errors.password?.message}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Input
                id="firstName"
                label="السمية"
                {...register('firstName', { required: 'خاصك تكتب السمية' })}
                error={errors.firstName?.message}
              />
              <Select
                id="gender"
                label="الجنس"
                {...register('gender')}
                options={[
                  { value: 'MALE', label: 'ذكر' },
                  { value: 'FEMALE', label: 'أنثى' },
                ]}
              />
              <Input
                id="birthDate"
                label="تاريخ الميلاد"
                type="date"
                {...register('birthDate', { required: 'خاصك تحدد تاريخ الميلاد' })}
                error={errors.birthDate?.message}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                id="residenceCountry"
                label="بلد الإقامة الحالية"
                placeholder="المغرب، فرنسا، الإمارات..."
                {...register('residenceCountry', { required: 'خاصك تحدد بلد الإقامة' })}
                error={errors.residenceCountry?.message}
              />
              <Input
                id="currentCity"
                label="المدينة"
                {...register('currentCity', { required: 'خاصك تحدد المدينة' })}
                error={errors.currentCity?.message}
              />
              <Input
                id="originCountry"
                label="بلد الأصل"
                {...register('originCountry', { required: 'خاصك تحدد بلد الأصل' })}
                error={errors.originCountry?.message}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Select
                id="relocationPreference"
                label="الاستعداد للانتقال أو الزواج بالجالية"
                {...register('relocationPreference')}
                options={[
                  { value: 'OPEN_TO_MOVE', label: 'مستعد نتنقل' },
                  { value: 'LOOKING_FOR_EXPAT', label: 'كنبحث فـ الجالية' },
                  { value: 'LOCAL_ONLY', label: 'فـ بلدي فقط' },
                ]}
              />
              <Input id="jobTitle" label="المهنة (اختياري)" {...register('jobTitle')} />
              <Input id="bio" label="نبذة عنك (اختياري)" {...register('bio')} />
            </>
          )}

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <div className="mt-2 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={goBack} className="flex-1">
                رجوع
              </Button>
            )}
            {!isLastStep ? (
              <Button key="next" type="button" onClick={goNext} className="flex-1">
                التالي
              </Button>
            ) : (
              <Button key="submit" type="submit" loading={loading} className="flex-1">
                إنشاء الحساب
              </Button>
            )}
          </div>
        </form>

        {step === 0 && (
          <p className="mt-6 text-center text-sm text-ink-500">
            عندك حساب من قبل؟{' '}
            <Link href="/login" className="font-semibold text-emerald-600">
              دخول
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
