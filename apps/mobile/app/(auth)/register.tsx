import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { register as registerUser, checkPhoneAvailability } from '@/services/auth.service';
import { updateProfile } from '@/services/users.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { OptionPicker } from '@/components/OptionPicker';
import { StepIndicator } from '@/components/StepIndicator';
import { ImageUploader } from '@/components/ImageUploader';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

const TOTAL_STEPS = 5;

export default function RegisterScreen() {
  const router = useRouter();
  const { dict, row } = useAppDict();
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthDate, setBirthDate] = useState('');
  const [residenceCountry, setResidenceCountry] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [relocationPreference, setRelocationPreference] = useState('OPEN_TO_MOVE');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const isLastStep = step === TOTAL_STEPS - 1;

  function validateStep(): boolean {
    if (step === 0) return phoneNumber.trim().length >= 8 && password.length >= 8;
    if (step === 1) return firstName.trim().length >= 2 && birthDate.trim().length > 0;
    if (step === 2) return residenceCountry.trim().length > 0 && currentCity.trim().length > 0 && originCountry.trim().length > 0;
    return true;
  }

  async function goNext() {
    if (!validateStep()) {
      setError(dict.register.errorFieldsRequired);
      return;
    }
    setError(null);

    if (step === 0) {
      setCheckingPhone(true);
      try {
        const available = await checkPhoneAvailability(phoneNumber);
        if (!available) {
          setError(dict.register.errorPhoneTaken);
          return;
        }
      } catch {
        // Best-effort: if the check itself fails, let the final submit catch a real conflict.
      } finally {
        setCheckingPhone(false);
      }
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await registerUser({
        phoneNumber,
        password,
        firstName,
        gender,
        birthDate,
        residenceCountry,
        currentCity,
        originCountry,
      });
      setSession(accessToken, user);

      const updatedUser = await updateProfile({
        relocationPreference: relocationPreference as any,
        jobTitle,
        bio,
        photos: photoUrl ? [photoUrl] : undefined,
      });
      setSession(accessToken, updatedUser);

      router.replace('/verification');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError(dict.register.errorPhoneTaken);
      } else {
        setError(dict.common.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{dict.register.title}</Text>
          <Text style={styles.subtitle}>{dict.register.stepOf(step + 1, TOTAL_STEPS)}</Text>
          <StepIndicator total={TOTAL_STEPS} current={step} />

          <View style={styles.form}>
            {step === 0 && (
              <>
                <Input
                  label={dict.register.phoneLabel}
                  placeholder={dict.register.phonePlaceholder}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
                <Input label={dict.register.passwordLabel} secureTextEntry value={password} onChangeText={setPassword} />
              </>
            )}

            {step === 1 && (
              <>
                <Input label={dict.register.firstNameLabel} value={firstName} onChangeText={setFirstName} />
                <OptionPicker
                  label={dict.register.genderLabel}
                  value={gender}
                  onChange={(v) => setGender(v as 'MALE' | 'FEMALE')}
                  options={[
                    { value: 'MALE', label: dict.register.genderMale },
                    { value: 'FEMALE', label: dict.register.genderFemale },
                  ]}
                />
                <Input
                  label={dict.register.birthDateLabel}
                  placeholder={dict.register.birthDatePlaceholder}
                  value={birthDate}
                  onChangeText={setBirthDate}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label={dict.register.residenceCountryLabel}
                  placeholder={dict.register.residenceCountryPlaceholder}
                  value={residenceCountry}
                  onChangeText={setResidenceCountry}
                />
                <Input label={dict.register.currentCityLabel} value={currentCity} onChangeText={setCurrentCity} />
                <Input label={dict.register.originCountryLabel} value={originCountry} onChangeText={setOriginCountry} />
              </>
            )}

            {step === 3 && (
              <>
                <OptionPicker
                  label={dict.register.relocationLabel}
                  value={relocationPreference}
                  onChange={setRelocationPreference}
                  options={[
                    { value: 'OPEN_TO_MOVE', label: dict.register.relocationOpen },
                    { value: 'LOOKING_FOR_EXPAT', label: dict.register.relocationExpat },
                    { value: 'LOCAL_ONLY', label: dict.register.relocationLocal },
                  ]}
                />
                <Input label={dict.register.jobTitleLabel} value={jobTitle} onChangeText={setJobTitle} />
                <Input label={dict.register.bioLabel} value={bio} onChangeText={setBio} />
              </>
            )}

            {step === 4 && <ImageUploader label={dict.register.photoLabel} onUploaded={setPhotoUrl} folder="zawaj/profiles" />}

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={[styles.actions, { flexDirection: row }]}>
              {step > 0 && (
                <Button variant="ghost" onPress={goBack} style={styles.flexBtn}>
                  {dict.register.back}
                </Button>
              )}
              {!isLastStep ? (
                <Button loading={checkingPhone} onPress={goNext} style={styles.flexBtn}>
                  {dict.register.next}
                </Button>
              ) : (
                <Button loading={loading} onPress={onSubmit} style={styles.flexBtn}>
                  {dict.register.submit}
                </Button>
              )}
            </View>
          </View>

          {step === 0 && (
            <View style={[styles.footer, { flexDirection: row }]}>
              <Text style={styles.footerText}>{dict.register.haveAccount}</Text>
              <Link href="/(auth)/login" style={styles.footerLink}>
                {dict.register.loginLink}
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.emerald50 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.white, borderRadius: 28, padding: 28, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.emerald700, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'center' },
  form: { gap: 14, marginTop: 8 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
  actions: { gap: 12, marginTop: 4 },
  flexBtn: { flex: 1 },
  footer: { justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: colors.ink500 },
  footerLink: { fontSize: 13, fontWeight: '700', color: colors.emerald600 },
});
