import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export function VerificationBanner({ status }: { status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' }) {
  const router = useRouter();
  const { dict, textAlign } = useAppDict();
  if (status === 'VERIFIED') return null;

  const COPY: Record<string, { title: string; subtitle: string; bg: string; fg: string }> = {
    UNVERIFIED: {
      title: dict.verificationBanner.unverifiedTitle,
      subtitle: dict.verificationBanner.unverifiedSubtitle,
      bg: colors.gold100,
      fg: colors.emerald900,
    },
    PENDING: {
      title: dict.verificationBanner.pendingTitle,
      subtitle: dict.verificationBanner.pendingSubtitle,
      bg: colors.emerald50,
      fg: colors.emerald700,
    },
    REJECTED: {
      title: dict.verificationBanner.rejectedTitle,
      subtitle: dict.verificationBanner.rejectedSubtitle,
      bg: colors.rose100,
      fg: colors.red500,
    },
  };

  const copy = COPY[status];

  return (
    <View style={[styles.banner, { backgroundColor: copy.bg }]}>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: copy.fg, textAlign }]}>{copy.title}</Text>
        <Text style={[styles.subtitle, { color: copy.fg, textAlign }]}>{copy.subtitle}</Text>
      </View>
      {status !== 'PENDING' && (
        <Pressable onPress={() => router.push('/verification')}>
          <Text style={[styles.link, { color: copy.fg }]}>{dict.verificationBanner.verifyNow}</Text>
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
  title: { fontSize: 14, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  link: { fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
});
