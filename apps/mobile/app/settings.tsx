import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { changePassword } from '@/services/users.service';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { NavBar } from '@/components/NavBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';
import { useAppConfigStore } from '@/store/appConfig.store';

export default function SettingsScreen() {
  const router = useRouter();
  const { dict, textAlign, row } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const { config } = useAppConfigStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && !token) router.replace('/(auth)/login');
  }, [token, hasHydrated]);

  async function onSubmit() {
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError(dict.settings.errorPasswordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(dict.settings.errorPasswordMismatch);
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
        setError(dict.settings.errorWrongPassword);
      } else {
        setError(dict.common.errorGeneric);
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
        <Text style={[styles.title, { textAlign }]}>{dict.settings.title}</Text>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { textAlign }]}>{dict.settings.changePasswordTitle}</Text>
          <Text style={[styles.subtitle, { textAlign }]}>{dict.settings.changePasswordSubtitle}</Text>

          <View style={styles.form}>
            <Input label={dict.settings.currentPasswordLabel} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
            <Input label={dict.settings.newPasswordLabel} secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <Input label={dict.settings.confirmPasswordLabel} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{dict.settings.success}</Text>}

            <Button loading={loading} onPress={onSubmit}>
              {dict.settings.save}
            </Button>
          </View>
        </View>

        <Pressable style={[styles.card, styles.langRow, { flexDirection: row }]} onPress={() => setLangOpen(true)}>
          <Text style={[styles.cardTitle, { textAlign }]}>{dict.settings.languageTitle}</Text>
          <Text style={styles.langIcon}>🌐</Text>
        </Pressable>

        <LanguageSelector visible={langOpen} onClose={() => setLangOpen(false)} />

        {(config?.privacyPolicy.url || config?.termsConditions.url || config?.moreAppsLink) && (
          <View style={styles.card}>
            {!!config?.privacyPolicy.url && (
              <Pressable onPress={() => Linking.openURL(config.privacyPolicy.url!)}>
                <Text style={[styles.link, { textAlign }]}>{dict.settings.privacyPolicyLink}</Text>
              </Pressable>
            )}
            {!!config?.termsConditions.url && (
              <Pressable onPress={() => Linking.openURL(config.termsConditions.url!)}>
                <Text style={[styles.link, { textAlign }]}>{dict.settings.termsLink}</Text>
              </Pressable>
            )}
            {!!config?.moreAppsLink && (
              <Pressable onPress={() => Linking.openURL(config.moreAppsLink!)}>
                <Text style={[styles.link, { textAlign }]}>{dict.settings.moreAppsLink}</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 16, gap: 16 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700 },
  card: { backgroundColor: colors.white, borderRadius: 28, padding: 24, gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.emerald700 },
  subtitle: { fontSize: 13, color: colors.ink500, marginTop: 2 },
  form: { gap: 14, marginTop: 14 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
  success: { fontSize: 13, color: colors.emerald600, textAlign: 'center' },
  langRow: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  langIcon: { fontSize: 20 },
  link: { fontSize: 14, fontWeight: '600', color: colors.emerald700, paddingVertical: 8 },
});
