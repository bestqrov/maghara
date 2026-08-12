import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface Option {
  value: string;
  label: string;
}

interface OptionPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function OptionPicker({ label, value, onChange, options }: OptionPickerProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink700, textAlign: 'right' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  chip: {
    borderWidth: 1,
    borderColor: colors.emerald100,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: colors.emerald600, borderColor: colors.emerald600 },
  chipText: { fontSize: 13, color: colors.ink700 },
  chipTextSelected: { color: colors.white, fontWeight: '600' },
});
