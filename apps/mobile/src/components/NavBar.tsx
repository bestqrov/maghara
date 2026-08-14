import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/theme/colors';

const LINKS = [
  { href: '/', label: 'البحث' },
  { href: '/visitors', label: 'الزوار' },
  { href: '/matches', label: 'الاهتمامات' },
  { href: '/store', label: 'المتجر' },
] as const;

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{link.label}</Text>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => router.push('/settings')}
        style={[styles.iconTab, pathname === '/settings' && styles.tabActive]}
      >
        <Text style={[styles.tabText, pathname === '/settings' && styles.tabTextActive]}>⚙️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, padding: 6, gap: 6 },
  tab: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  iconTab: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.emerald600 },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.emerald700 },
  tabTextActive: { color: colors.white },
});
