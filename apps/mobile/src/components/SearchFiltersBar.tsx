import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Input } from './Input';
import { Button } from './Button';
import { colors } from '@/theme/colors';
import { SearchFilters } from '@/services/matching.service';

interface SearchFiltersBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export function SearchFiltersBar({ onSearch, loading }: SearchFiltersBarProps) {
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
      relocationPreference: nextTab === 'diaspora' ? 'LOOKING_FOR_EXPAT' : undefined,
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
          <Text style={[styles.tabText, tab === 'local' && styles.tabTextActive]}>البحث المحلي</Text>
        </Pressable>
        <Pressable onPress={() => selectTab('diaspora')} style={[styles.tab, tab === 'diaspora' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'diaspora' && styles.tabTextActive]}>الجالية / الزواج الدولي</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Input placeholder="السن من" keyboardType="numeric" value={minAge} onChangeText={setMinAge} style={styles.half} />
        <Input placeholder="السن إلى" keyboardType="numeric" value={maxAge} onChangeText={setMaxAge} style={styles.half} />
      </View>
      <View style={styles.row}>
        <Input placeholder="البلد" value={targetCountry} onChangeText={setTargetCountry} style={styles.half} />
        <Input placeholder="المدينة" value={targetCity} onChangeText={setTargetCity} style={styles.half} />
      </View>

      <Button loading={loading} onPress={() => submit()}>
        بحث
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
  row: { flexDirection: 'row-reverse', gap: 10 },
  half: { flex: 1 },
});
