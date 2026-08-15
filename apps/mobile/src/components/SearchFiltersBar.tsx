import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Input } from './Input';
import { Button } from './Button';
import { colors } from '@/theme/colors';
import { SearchFilters } from '@/services/matching.service';
import { useAppDict } from '@/hooks/useLocale';

interface SearchFiltersBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export function SearchFiltersBar({ onSearch, loading }: SearchFiltersBarProps) {
  const { dict, row } = useAppDict();
  const [tab, setTab] = useState<'local' | 'diaspora'>('local');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetCity, setTargetCity] = useState('');

  function submit(nextTab: 'local' | 'diaspora' = tab) {
    onSearch({
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      targetCountry: targetCountry || undefined,
      targetCity: targetCity || undefined,
      scope: nextTab === 'diaspora' ? 'DIASPORA' : 'LOCAL',
    });
  }

  function selectTab(nextTab: 'local' | 'diaspora') {
    setTab(nextTab);
    submit(nextTab);
  }

  return (
    <View style={styles.card}>
      <View style={styles.tabs}>
        <Pressable onPress={() => selectTab('local')} style={[styles.tab, tab === 'local' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'local' && styles.tabTextActive]}>{dict.searchFilters.local}</Text>
        </Pressable>
        <Pressable onPress={() => selectTab('diaspora')} style={[styles.tab, tab === 'diaspora' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'diaspora' && styles.tabTextActive]}>{dict.searchFilters.diaspora}</Text>
        </Pressable>
      </View>

      <View style={[styles.row, { flexDirection: row }]}>
        <Input placeholder={dict.searchFilters.ageFrom} keyboardType="numeric" value={minAge} onChangeText={setMinAge} style={styles.half} />
        <Input placeholder={dict.searchFilters.ageTo} keyboardType="numeric" value={maxAge} onChangeText={setMaxAge} style={styles.half} />
      </View>
      <View style={[styles.row, { flexDirection: row }]}>
        <Input placeholder={dict.searchFilters.country} value={targetCountry} onChangeText={setTargetCountry} style={styles.half} />
        <Input placeholder={dict.searchFilters.city} value={targetCity} onChangeText={setTargetCity} style={styles.half} />
      </View>

      <Button loading={loading} onPress={() => submit()}>
        {dict.searchFilters.submit}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 14, gap: 10 },
  tabs: { flexDirection: 'row', backgroundColor: colors.emerald50, borderRadius: 12, padding: 4, gap: 4 },
  tab: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  tabActive: { backgroundColor: colors.emerald600 },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.emerald700 },
  tabTextActive: { color: colors.white },
  row: { gap: 10 },
  half: { flex: 1 },
});
