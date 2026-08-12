import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, submitVerification, VerificationStatusResponse } from '@/services/verification.service';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';

export default function VerificationScreen() {
  const router = useRouter();
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
        setError(err.response?.data?.message ?? 'كاين مشكل، حاول مرة أخرى');
      } else {
        setError('كاين مشكل، حاول مرة أخرى');
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
        <Text style={styles.title}>وثّق حسابك مجاناً</Text>
        <Text style={styles.subtitle}>
          صيفط CIN أو Passport للحصول على شارة &quot;عضو جاد وموثق&quot; وزد فرصك فـ الظهور
        </Text>

        {alreadySubmitted ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>
              {status?.verificationStatus === 'VERIFIED'
                ? 'حسابك موثق بالفعل ✓'
                : 'طلب التوثيق ديالك قيد المراجعة، غادي نعلموك بالنتيجة قريباً'}
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input label="رابط صورة CIN / Passport" placeholder="https://..." value={idDocumentUrl} onChangeText={setIdDocumentUrl} />
            <Input label="رابط وثيقة الإقامة بالخارج (اختياري)" placeholder="https://..." value={residencyDocumentUrl} onChangeText={setResidencyDocumentUrl} />
            <Text style={styles.hint}>* فـ النسخة النهائية غادي يكون رفع مباشر للصورة (Cloudinary) بدل الرابط.</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <Button loading={loading} onPress={onSubmit}>
              صيفط للمراجعة
            </Button>
          </View>
        )}

        <Button variant="ghost" onPress={() => router.replace('/')}>
          تخطى دابا، نوثق من بعد
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
  hint: { fontSize: 11, color: colors.ink500, textAlign: 'right' },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
});
