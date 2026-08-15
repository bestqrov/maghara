import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { textAlign } = useAppDict();
  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, { textAlign }]}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.ink500}
        style={[styles.input, { textAlign }, error ? styles.inputError : null, style as object]}
        {...props}
      />
      {error && <Text style={[styles.error, { textAlign }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink700 },
  input: {
    borderWidth: 1,
    borderColor: colors.emerald100,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink700,
  },
  inputError: { borderColor: colors.red400 },
  error: { fontSize: 12, color: colors.red500 },
});
