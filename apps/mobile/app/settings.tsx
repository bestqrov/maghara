import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { changePassword } from '@/services/users.service';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { NavBar } from '@/components/NavBar';
import { colors } from '@/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasHydrated && !token) router.replace('/(auth)/login');
  }, [token, hasHydrated]);

  async function onSubmit() {
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('الپاسوورد الجديد خاصو يكون 8 حروف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('الپاسوورد الجديد ماشي متطابق مع التأكيد');
      return;
    }

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('الپاسوورد الحالي غير صحيح');
      } else {
        setError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated || !token) return null;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <NavBar />
        <Text style={styles.title}>الإعدادات</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>بدّل الپاسوورد</Text>
          <Text style={styles.subtitle}>دخل الپاسوورد الحالي، وحدد وحدة جديدة</Text>

          <View style={styles.form}>
            <Input label="الپاسوورد الحالي" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
            <Input label="الپاسوورد الجديد" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <Input label="أكد الپاسوورد الجديد" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>تبدل الپاسوورد بنجاح</Text>}

            <Button loading={loading} onPress={onSubmit}>
              حفظ
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 16, gap: 16 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700, textAlign: 'right' },
  card: { backgroundColor: colors.white, borderRadius: 28, padding: 24, gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.emerald700, textAlign: 'right' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'right', marginTop: 2 },
  form: { gap: 14, marginTop: 14 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
  success: { fontSize: 13, color: colors.emerald600, textAlign: 'center' },
});
