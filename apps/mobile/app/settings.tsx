import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { changePassword, deleteAccount } from '@/services/users.service';
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
  const { token, hasHydrated, logout } = useAuthStore();
  const { config } = useAppConfigStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function onConfirmDelete() {
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await deleteAccount({ password: deletePassword });
      setDeleteModalOpen(false);
      logout();
      router.replace('/(auth)/login');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setDeleteError(dict.settings.deleteAccountErrorWrongPassword);
      } else {
        setDeleteError(dict.common.errorGeneric);
      }
    } finally {
      setDeleteLoading(false);
    }
  }

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

        <View style={[styles.card, styles.dangerCard]}>
          <Text style={[styles.dangerTitle, { textAlign }]}>{dict.settings.deleteAccountTitle}</Text>
          <Text style={[styles.dangerSubtitle, { textAlign }]}>{dict.settings.deleteAccountSubtitle}</Text>
          <Button
            variant="danger"
            onPress={() => {
              setDeleteError(null);
              setDeletePassword('');
              setDeleteModalOpen(true);
            }}
          >
            {dict.settings.deleteAccountButton}
          </Button>
        </View>
      </ScrollView>

      <Modal visible={deleteModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.dangerTitle}>{dict.settings.deleteAccountConfirmTitle}</Text>
            <Text style={styles.modalBody}>{dict.settings.deleteAccountConfirmBody}</Text>
            <View style={{ marginTop: 12, width: '100%' }}>
              <Input
                label={dict.settings.deleteAccountPasswordLabel}
                secureTextEntry
                value={deletePassword}
                onChangeText={setDeletePassword}
              />
            </View>
            {deleteError && <Text style={styles.error}>{deleteError}</Text>}
            <View style={{ flexDirection: row, gap: 10, marginTop: 16, width: '100%' }}>
              <Button variant="ghost" onPress={() => setDeleteModalOpen(false)} style={{ flex: 1 }}>
                {dict.settings.deleteAccountCancel}
              </Button>
              <Button
                variant="danger"
                onPress={onConfirmDelete}
                loading={deleteLoading}
                disabled={!deletePassword}
                style={{ flex: 1 }}
              >
                {dict.settings.deleteAccountConfirm}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  dangerCard: { borderWidth: 1, borderColor: colors.red400 },
  dangerTitle: { fontSize: 16, fontWeight: '800', color: colors.red500 },
  dangerSubtitle: { fontSize: 12, color: colors.ink500, marginTop: 2, marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,46,29,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 360, backgroundColor: colors.white, borderRadius: 24, padding: 20, alignItems: 'center' },
  modalBody: { fontSize: 13, color: colors.ink700, textAlign: 'center', marginTop: 8 },
});
