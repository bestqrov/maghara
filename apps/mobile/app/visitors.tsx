import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { getMyVisitors, VisitorEntry } from '@/services/visitors.service';
import { BlurredImage } from '@/components/BlurredImage';
import { NavBar } from '@/components/NavBar';
import { colors } from '@/theme/colors';

export default function VisitorsScreen() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    getMyVisitors()
      .then(setVisitors)
      .finally(() => setLoading(false));
  }, [token, hasHydrated]);

  const lockedCount = visitors.filter((v) => v.locked).length;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visitors}
      keyExtractor={(_, index) => String(index)}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      ListHeaderComponent={
        <View style={{ gap: 14, marginBottom: 8 }}>
          <NavBar />
          <View>
            <Text style={styles.title}>زوار البروفايل ديالك</Text>
            <Text style={styles.subtitle}>هادو الناس لي زارو البروفايل ديالك مؤخراً</Text>
          </View>
          {lockedCount > 0 && (
            <View style={styles.lockedBanner}>
              <Text style={styles.lockedText}>
                {lockedCount} زوار آخرين زارو البروفايل ديالك! رقّي لـ VIP باش تشوف شكون هوما
              </Text>
            </View>
          )}
          {!loading && visitors.length === 0 && (
            <Text style={styles.empty}>حتى واحد مازال ما زار البروفايل ديالك</Text>
          )}
        </View>
      }
      renderItem={({ item }) => {
        const photoUri = item.visitor?.profile.photos[0] ?? 'https://placehold.co/300x300/eef6f0/2f7a52?text=Zawaj';
        return (
          <View style={styles.item}>
            <BlurredImage source={{ uri: photoUri }} isBlurred={item.locked} style={styles.image} lockLabel="ترقى لـ VIP" />
            <Text style={styles.name}>{item.locked ? '••••••' : item.visitor?.profile.firstName}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700, textAlign: 'right' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'right', marginTop: 2 },
  lockedBanner: { backgroundColor: colors.gold100, borderRadius: 16, padding: 12 },
  lockedText: { fontSize: 13, fontWeight: '600', color: colors.emerald900, textAlign: 'right' },
  empty: { fontSize: 13, color: colors.ink500, textAlign: 'center', paddingVertical: 20 },
  item: { flex: 1, alignItems: 'center', gap: 6 },
  image: { width: '100%', aspectRatio: 1 },
  name: { fontSize: 12, fontWeight: '600', color: colors.ink700 },
});
