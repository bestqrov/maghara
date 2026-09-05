import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'gold' | 'ghost' | 'danger';
  loading?: boolean;
  children: string;
}

export function Button({ variant = 'primary', loading, disabled, children, style, ...props }: ButtonProps) {
  const variantStyle = styles[variant];
  const textStyle = variant === 'ghost' ? styles.ghostText : variant === 'gold' ? styles.goldText : styles.primaryText;

  return (
    <Pressable
      disabled={disabled || loading}
      style={[styles.base, variantStyle, (disabled || loading) && styles.disabled, style as object]}
      {...props}
    >
      {loading && <ActivityIndicator color={variant === 'gold' ? colors.emerald900 : colors.white} />}
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: colors.emerald600 },
  gold: { backgroundColor: colors.gold500 },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.red500 },
  primaryText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  goldText: { color: colors.emerald900, fontWeight: '600', fontSize: 15 },
  ghostText: { color: colors.emerald700, fontWeight: '600', fontSize: 15 },
});
