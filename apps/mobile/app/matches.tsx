import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { acceptMatch, getMyMatches, markEngaged, MatchEntry, rejectMatch } from '@/services/matching.service';
import { getOrCreateConversation } from '@/services/chat.service';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { BannerAdSlot } from '@/components/ads/BannerAdSlot';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export default function MatchesScreen() {
  const router = useRouter();
  const { dict, row, textAlign } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const [matches, setMatches] = useState<MatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const STATUS_LABEL: Record<string, string> = {
    PENDING: dict.matches.statusPending,
    ACCEPTED: dict.matches.statusAccepted,
    REJECTED: dict.matches.statusRejected,
    ENGAGED: dict.matches.statusEngaged,
  };

  async function refresh() {
    setLoading(true);
    try {
      setMatches(await getMyMatches());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasHydrated]);

  async function handleAccept(matchId: string) {
    setBusyId(matchId);
    try {
      await acceptMatch(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(matchId: string) {
    setBusyId(matchId);
    try {
      await rejectMatch(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleEngaged(matchId: string) {
    setBusyId(matchId);
    try {
      await markEngaged(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function openChat(matchId: string) {
    const conversation = await getOrCreateConversation(matchId);
    router.push({ pathname: '/chat/[conversationId]', params: { conversationId: conversation._id, matchId } });
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={matches}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View style={{ gap: 14, marginBottom: 8 }}>
          <NavBar />
          <Text style={[styles.title, { textAlign }]}>{dict.matches.title}</Text>
          <BannerAdSlot placement="bannerMatches" />
          {!loading && matches.length === 0 && <Text style={styles.empty}>{dict.matches.empty}</Text>}
        </View>
      }
      renderItem={({ item }) => {
        const photoUri = item.otherUser.profile.photos[0] ?? 'https://placehold.co/100x100/eef6f0/2f7a52?text=Z';
        const isBusy = busyId === item._id;
        return (
          <View style={[styles.row, { flexDirection: row }]}>
            <Image source={{ uri: photoUri }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { textAlign }]}>{item.otherUser.profile.firstName}</Text>
              <Text style={[styles.status, { textAlign }]}>
                {STATUS_LABEL[item.status]} · {item.direction === 'SENT' ? dict.matches.directionSent : dict.matches.directionReceived}
              </Text>
            </View>
            <View style={styles.actions}>
              {item.status === 'PENDING' && item.direction === 'RECEIVED' && (
                <>
                  <Button variant="gold" disabled={isBusy} onPress={() => handleAccept(item._id)}>
                    {dict.matches.accept}
                  </Button>
                  <Button variant="ghost" disabled={isBusy} onPress={() => handleReject(item._id)}>
                    {dict.matches.reject}
                  </Button>
                </>
              )}
              {(item.status === 'ACCEPTED' || item.status === 'ENGAGED') && (
                <>
                  <Button disabled={isBusy} onPress={() => openChat(item._id)}>
                    {dict.matches.chat}
                  </Button>
                  {item.status === 'ACCEPTED' && (
                    <Button variant="gold" disabled={isBusy} onPress={() => handleEngaged(item._id)}>
                      {dict.matches.markEngaged}
                    </Button>
                  )}
                </>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 10 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700 },
  empty: { fontSize: 13, color: colors.ink500, textAlign: 'center', paddingVertical: 20 },
  row: { alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18, padding: 12, marginBottom: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  name: { fontSize: 14, fontWeight: '700', color: colors.emerald900 },
  status: { fontSize: 12, color: colors.ink500, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
});
