import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export default function LoginScreen() {
  const router = useRouter();
  const { dict, row } = useAppDict();
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
        setError(dict.login.errorInvalid);
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
          <Text style={styles.title}>{dict.login.title}</Text>
          <Text style={styles.subtitle}>{dict.login.subtitle}</Text>

          <View style={styles.form}>
            <Input
              label={dict.login.phoneLabel}
              placeholder={dict.login.phonePlaceholder}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Input label={dict.login.passwordLabel} secureTextEntry value={password} onChangeText={setPassword} />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button loading={loading} onPress={onSubmit}>
              {dict.login.submit}
            </Button>
          </View>

          <View style={[styles.footer, { flexDirection: row }]}>
            <Text style={styles.footerText}>{dict.login.noAccount}</Text>
            <Link href="/(auth)/register" style={styles.footerLink}>
              {dict.login.registerLink}
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
  footer: { justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: colors.ink500 },
  footerLink: { fontSize: 13, fontWeight: '700', color: colors.emerald600 },
});
