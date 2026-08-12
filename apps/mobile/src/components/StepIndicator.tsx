import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current ? styles.dotActive : index < current ? styles.dotDone : styles.dotPending,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 32, backgroundColor: colors.emerald600 },
  dotDone: { width: 16, backgroundColor: colors.emerald300 },
  dotPending: { width: 16, backgroundColor: colors.emerald100 },
});
