import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, VerificationStatusResponse } from '@/services/verification.service';
import { getMe } from '@/services/users.service';
import {
  DAILY_FREE_INTERESTS,
  searchProfiles,
  sendInterest,
  SearchFilters,
  SearchResultProfile,
} from '@/services/matching.service';
import { VerificationBanner } from '@/components/VerificationBanner';
import { SearchFiltersBar } from '@/components/SearchFiltersBar';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { NavBar } from '@/components/NavBar';
import { recordVisit } from '@/services/visitors.service';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export default function HomeScreen() {
  const router = useRouter();
  const { dict, row, textAlign, alignEnd } = useAppDict();
  const { token, user, hasHydrated, logout } = useAuthStore();
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);
  const [results, setResults] = useState<SearchResultProfile[]>([]);
  const [dailyInterestsSent, setDailyInterestsSent] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';

  const runSearch = useCallback(
    async (filters: SearchFilters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchProfiles(filters);
        setResults(data);
      } catch {
        setError(dict.feed.errorSearchFailed);
      } finally {
        setLoading(false);
      }
    },
    [dict],
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    getMyVerificationStatus().then(setVerification).catch(() => setVerification(null));
    getMe().then((me) => setDailyInterestsSent(me.dailyInterestsSent)).catch(() => {});
    runSearch({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasHydrated]);

  async function handleSendInterest(receiverId: string) {
    try {
      await sendInterest(receiverId);
      setSentIds((prev) => new Set(prev).add(receiverId));
      setDailyInterestsSent((n) => n + 1);
    } catch {
      setError(dict.feed.errorSendInterestFailed);
    }
  }

  if (!token || !user) return null;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <View style={styles.headerSection}>
          <NavBar />
          <View style={[styles.header, { flexDirection: row }]}>
            <View>
              <Text style={[styles.greeting, { textAlign }]}>{dict.feed.greeting(user.profile.firstName)}</Text>
              <Text style={[styles.location, { textAlign }]}>
                {user.profile.currentCity} · {user.profile.residenceCountry}
              </Text>
            </View>
            <View style={{ alignItems: alignEnd, gap: 6 }}>
              {!isVip && (
                <Text style={styles.counter}>{dict.feed.interestsToday(dailyInterestsSent, DAILY_FREE_INTERESTS)}</Text>
              )}
              <Button
                variant="ghost"
                onPress={() => {
                  logout();
                  router.replace('/(auth)/login');
                }}
              >
                {dict.common.logout}
              </Button>
            </View>
          </View>

          {verification && <VerificationBanner status={verification.verificationStatus} />}
          <SearchFiltersBar onSearch={runSearch} loading={loading} />
          {error && <Text style={styles.error}>{error}</Text>}
          {results.length === 0 && !loading && <Text style={styles.empty}>{dict.feed.noResults}</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ProfileCard result={item} onSendInterest={handleSendInterest} onView={recordVisit} sent={sentIds.has(item._id)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  headerSection: { gap: 14, marginBottom: 8 },
  header: { justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 18, fontWeight: '800', color: colors.emerald700 },
  location: { fontSize: 13, color: colors.ink500, marginTop: 2 },
  counter: { fontSize: 11, fontWeight: '700', color: colors.emerald700, backgroundColor: colors.emerald50, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  columnWrapper: { gap: 12 },
  cardWrapper: { flex: 1 },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center' },
  empty: { fontSize: 13, color: colors.ink500, textAlign: 'center', paddingVertical: 20 },
});
