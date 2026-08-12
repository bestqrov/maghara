import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';

const COPY: Record<string, { title: string; subtitle: string; bg: string; fg: string }> = {
  UNVERIFIED: {
    title: 'وثّق حسابك مجاناً',
    subtitle: 'احصل على شارة "عضو جاد وموثق" وزد فرصك فـ الظهور فـ البحث',
    bg: colors.gold100,
    fg: colors.emerald900,
  },
  PENDING: {
    title: 'التوثيق قيد المراجعة',
    subtitle: 'غادي نراجعو الوثائق ديالك ونعلموك بالنتيجة قريباً',
    bg: colors.emerald50,
    fg: colors.emerald700,
  },
  REJECTED: {
    title: 'التوثيق تم رفضه',
    subtitle: 'حاول تصيفط وثيقة أوضح، أو تواصل مع الدعم',
    bg: colors.rose100,
    fg: colors.red500,
  },
};

export function VerificationBanner({ status }: { status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' }) {
  const router = useRouter();
  if (status === 'VERIFIED') return null;
  const copy = COPY[status];

  return (
    <View style={[styles.banner, { backgroundColor: copy.bg }]}>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: copy.fg }]}>{copy.title}</Text>
        <Text style={[styles.subtitle, { color: copy.fg }]}>{copy.subtitle}</Text>
      </View>
      {status !== 'PENDING' && (
        <Pressable onPress={() => router.push('/verification')}>
          <Text style={[styles.link, { color: copy.fg }]}>وثّق دابا</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  textCol: { flex: 1, gap: 2 },
  title: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  subtitle: { fontSize: 12, textAlign: 'right' },
  link: { fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
});
