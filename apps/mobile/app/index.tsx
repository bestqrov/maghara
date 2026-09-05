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
import { BannerAdSlot } from '@/components/ads/BannerAdSlot';
import { NativeAdCard } from '@/components/ads/NativeAdCard';
import { Button } from '@/components/Button';
import { NavBar } from '@/components/NavBar';
import { recordVisit } from '@/services/visitors.service';
import { useAdSettingsStore } from '@/store/adSettings.store';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

type FeedRow =
  | { type: 'profiles'; key: string; items: SearchResultProfile[] }
  | { type: 'ad'; key: string };

function buildRows(results: SearchResultProfile[], adEvery: number, adEnabled: boolean): FeedRow[] {
  const rows: FeedRow[] = [];
  let profilesSinceAd = 0;
  for (let i = 0; i < results.length; i += 2) {
    const items = results.slice(i, i + 2);
    rows.push({ type: 'profiles', key: `row-${i}`, items });
    profilesSinceAd += items.length;
    if (adEnabled && profilesSinceAd >= adEvery) {
      rows.push({ type: 'ad', key: `ad-${i}` });
      profilesSinceAd = 0;
    }
  }
  return rows;
}

export default function HomeScreen() {
  const router = useRouter();
  const { dict, row, textAlign, alignEnd } = useAppDict();
  const { token, user, hasHydrated, logout } = useAuthStore();
  const { settings: adSettings, fetch: fetchAdSettings } = useAdSettingsStore();
  const { notifyAction } = useInterstitialAd();
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
    fetchAdSettings();
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

  function handleView(id: string) {
    recordVisit(id);
    notifyAction();
  }

  if (!token || !user) return null;

  const nativeAdEnabled = !!(adSettings?.active && adSettings.placements.nativeFeed && adSettings.admobNativeAdUnitId);
  const rows = buildRows(results, adSettings?.nativeAdIndex ?? 5, nativeAdEnabled);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={rows}
      keyExtractor={(item) => item.key}
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
          <BannerAdSlot placement="bannerHome" />
          <SearchFiltersBar onSearch={runSearch} loading={loading} />
          {error && <Text style={styles.error}>{error}</Text>}
          {results.length === 0 && !loading && <Text style={styles.empty}>{dict.feed.noResults}</Text>}
        </View>
      }
      renderItem={({ item }) =>
        item.type === 'ad' ? (
          <View style={styles.cardWrapper}>
            <NativeAdCard unitId={adSettings!.admobNativeAdUnitId!} />
          </View>
        ) : (
          <View style={[styles.columnWrapper, { flexDirection: row }]}>
            {item.items.map((profile) => (
              <View key={profile._id} style={styles.cardWrapper}>
                <ProfileCard
                  result={profile}
                  onSendInterest={handleSendInterest}
                  onView={handleView}
                  sent={sentIds.has(profile._id)}
                />
              </View>
            ))}
          </View>
        )
      }
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
