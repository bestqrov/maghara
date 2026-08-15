import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, submitVerification, VerificationStatusResponse } from '@/services/verification.service';
import { Button } from '@/components/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export default function VerificationScreen() {
  const router = useRouter();
  const { dict } = useAppDict();
  const token = useAuthStore((s) => s.token);
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [residencyDocumentUrl, setResidencyDocumentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    getMyVerificationStatus().then(setStatus).catch(() => setStatus(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await submitVerification({ idDocumentUrl, residencyDocumentUrl: residencyDocumentUrl || undefined });
      const updated = await getMyVerificationStatus();
      setStatus(updated);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? dict.common.errorGeneric);
      } else {
        setError(dict.common.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  const alreadySubmitted = status?.verificationStatus === 'PENDING' || status?.verificationStatus === 'VERIFIED';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🛡️</Text>
        </View>
        <Text style={styles.title}>{dict.verification.title}</Text>
        <Text style={styles.subtitle}>{dict.verification.subtitle}</Text>

        {alreadySubmitted ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>
              {status?.verificationStatus === 'VERIFIED' ? dict.verification.alreadyVerified : dict.verification.alreadyPending}
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <ImageUploader label={dict.verification.idLabel} onUploaded={setIdDocumentUrl} folder="zawaj/verification" />
            <ImageUploader
              label={dict.verification.residencyLabel}
              onUploaded={setResidencyDocumentUrl}
              folder="zawaj/verification"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button loading={loading} onPress={onSubmit} disabled={!idDocumentUrl}>
              {dict.verification.submit}
            </Button>
          </View>
        )}

        <Button variant="ghost" onPress={() => router.replace('/')}>
          {dict.verification.skip}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.emerald50 },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.white, borderRadius: 28, padding: 28, gap: 14, alignItems: 'center' },
  badge: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.gold100, alignItems: 'center', justifyContent: 'center' },
  badgeIcon: { fontSize: 26 },
  title: { fontSize: 20, fontWeight: '800', color: colors.emerald700, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'center' },
  form: { width: '100%', gap: 14 },
  pendingBox: { width: '100%', backgroundColor: colors.emerald50, borderRadius: 14, padding: 14 },
  pendingText: { color: colors.emerald700, textAlign: 'center', fontSize: 13 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
});
