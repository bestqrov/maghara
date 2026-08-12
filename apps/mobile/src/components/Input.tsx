import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@/theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.ink500}
        style={[styles.input, error ? styles.inputError : null, style as object]}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink700, textAlign: 'right' },
  input: {
    borderWidth: 1,
    borderColor: colors.emerald100,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink700,
    textAlign: 'right',
  },
  inputError: { borderColor: colors.red400 },
  error: { fontSize: 12, color: colors.red500, textAlign: 'right' },
});
