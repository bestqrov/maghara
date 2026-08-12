import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { register as registerUser } from '@/services/auth.service';
import { updateProfile } from '@/services/users.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { OptionPicker } from '@/components/OptionPicker';
import { StepIndicator } from '@/components/StepIndicator';
import { ImageUploader } from '@/components/ImageUploader';
import { colors } from '@/theme/colors';

const TOTAL_STEPS = 5;

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  function goNext() {
    if (!validateStep()) {
      setError('خاصك تعمر الحقول المطلوبة');
      return;
    }
    setError(null);
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
        setError('رقم الهاتف هذا مسجل من قبل');
      } else {
        setError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>إنشاء حساب جديد</Text>
          <Text style={styles.subtitle}>
            خطوة {step + 1} من {TOTAL_STEPS}
          </Text>
          <StepIndicator total={TOTAL_STEPS} current={step} />

          <View style={styles.form}>
            {step === 0 && (
              <>
                <Input label="رقم الهاتف" placeholder="+212600000000" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
                <Input label="الپاسوورد" secureTextEntry value={password} onChangeText={setPassword} />
              </>
            )}

            {step === 1 && (
              <>
                <Input label="السمية" value={firstName} onChangeText={setFirstName} />
                <OptionPicker
                  label="الجنس"
                  value={gender}
                  onChange={(v) => setGender(v as 'MALE' | 'FEMALE')}
                  options={[
                    { value: 'MALE', label: 'ذكر' },
                    { value: 'FEMALE', label: 'أنثى' },
                  ]}
                />
                <Input label="تاريخ الميلاد (YYYY-MM-DD)" placeholder="1995-01-01" value={birthDate} onChangeText={setBirthDate} />
              </>
            )}

            {step === 2 && (
              <>
                <Input label="بلد الإقامة الحالية" placeholder="المغرب، فرنسا، الإمارات..." value={residenceCountry} onChangeText={setResidenceCountry} />
                <Input label="المدينة" value={currentCity} onChangeText={setCurrentCity} />
                <Input label="بلد الأصل" value={originCountry} onChangeText={setOriginCountry} />
              </>
            )}

            {step === 3 && (
              <>
                <OptionPicker
                  label="الاستعداد للانتقال أو الزواج بالجالية"
                  value={relocationPreference}
                  onChange={setRelocationPreference}
                  options={[
                    { value: 'OPEN_TO_MOVE', label: 'مستعد نتنقل' },
                    { value: 'LOOKING_FOR_EXPAT', label: 'كنبحث فـ الجالية' },
                    { value: 'LOCAL_ONLY', label: 'فـ بلدي فقط' },
                  ]}
                />
                <Input label="المهنة (اختياري)" value={jobTitle} onChangeText={setJobTitle} />
                <Input label="نبذة عنك (اختياري)" value={bio} onChangeText={setBio} />
              </>
            )}

            {step === 4 && (
              <ImageUploader label="صورة البروفايل (اختياري)" onUploaded={setPhotoUrl} folder="zawaj/profiles" />
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actions}>
              {step > 0 && (
                <Button variant="ghost" onPress={goBack} style={styles.flexBtn}>
                  رجوع
                </Button>
              )}
              {!isLastStep ? (
                <Button onPress={goNext} style={styles.flexBtn}>
                  التالي
                </Button>
              ) : (
                <Button loading={loading} onPress={onSubmit} style={styles.flexBtn}>
                  إنشاء الحساب
                </Button>
              )}
            </View>
          </View>

          {step === 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>عندك حساب من قبل؟ </Text>
              <Link href="/(auth)/login" style={styles.footerLink}>
                دخول
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
  actions: { flexDirection: 'row-reverse', gap: 12, marginTop: 4 },
  flexBtn: { flex: 1 },
  footer: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: colors.ink500 },
  footerLink: { fontSize: 13, fontWeight: '700', color: colors.emerald600 },
});
