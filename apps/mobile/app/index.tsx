import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, VerificationStatusResponse } from '@/services/verification.service';
import { VerificationBanner } from '@/components/VerificationBanner';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { token, user, hasHydrated, logout } = useAuthStore();
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    getMyVerificationStatus().then(setVerification).catch(() => setVerification(null));
  }, [token, hasHydrated]);

  if (!token || !user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>أهلاً {user.profile.firstName} 👋</Text>
          <Text style={styles.location}>
            {user.profile.currentCity} · {user.profile.residenceCountry}
          </Text>
        </View>
        <Button
          variant="ghost"
          onPress={() => {
            logout();
            router.replace('/(auth)/login');
          }}
        >
          خروج
        </Button>
      </View>

      {verification && <VerificationBanner status={verification.verificationStatus} />}

      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Feed / Search screen</Text>
        <Text style={styles.placeholderText}>
          هادي المرحلة الجاية: البحث، الزوار (المصيدة)، والشات — Auth & Onboarding خدامين دابا.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, gap: 16 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 18, fontWeight: '800', color: colors.emerald700, textAlign: 'right' },
  location: { fontSize: 13, color: colors.ink500, textAlign: 'right', marginTop: 2 },
  placeholder: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.emerald100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
  },
  placeholderTitle: { fontSize: 16, fontWeight: '700', color: colors.emerald700 },
  placeholderText: { fontSize: 13, color: colors.ink500, textAlign: 'center' },
});
