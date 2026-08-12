import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await login({ phoneNumber, password });
      setSession(accessToken, user);
      router.replace('/');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('رقم الهاتف أو الپاسوورد غير صحيحين');
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
          <Text style={styles.title}>مرحباً بك من جديد</Text>
          <Text style={styles.subtitle}>دخل لحسابك وكمّل رحلتك نحو الزواج</Text>

          <View style={styles.form}>
            <Input label="رقم الهاتف" placeholder="+212600000000" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
            <Input label="الپاسوورد" secureTextEntry value={password} onChangeText={setPassword} />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button loading={loading} onPress={onSubmit}>
              دخول
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>ماعندكش حساب؟ </Text>
            <Link href="/(auth)/register" style={styles.footerLink}>
              سجل دابا
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.emerald50 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.white, borderRadius: 28, padding: 28, gap: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.emerald700, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'center' },
  form: { gap: 14, marginTop: 8 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
  footer: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: colors.ink500 },
  footerLink: { fontSize: 13, fontWeight: '700', color: colors.emerald600 },
});
