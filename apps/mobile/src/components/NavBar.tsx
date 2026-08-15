import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';
import { LanguageSelector } from './LanguageSelector';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { dict, row } = useAppDict();
  const [langOpen, setLangOpen] = useState(false);

  const LINKS = [
    { href: '/', label: dict.nav.search },
    { href: '/visitors', label: dict.nav.visitors },
    { href: '/matches', label: dict.nav.matches },
    { href: '/store', label: dict.nav.store },
  ] as const;

  return (
    <View style={[styles.nav, { flexDirection: row }]}>
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
        <Text style={[styles.tabText, pathname === '/settings' && styles.tabTextActive]}>{dict.nav.settingsIcon}</Text>
      </Pressable>
      <Pressable onPress={() => setLangOpen(true)} style={styles.iconTab}>
        <Text style={styles.tabText}>🌐</Text>
      </Pressable>

      <LanguageSelector visible={langOpen} onClose={() => setLangOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { backgroundColor: colors.white, borderRadius: 16, padding: 6, gap: 6 },
  tab: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  iconTab: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.emerald600 },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.emerald700 },
  tabTextActive: { color: colors.white },
});
