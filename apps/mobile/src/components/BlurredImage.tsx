import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

interface BlurredImageProps {
  source: ImageSourcePropType;
  isBlurred: boolean;
  lockLabel?: string;
  style?: object;
  onUnlockPress?: () => void;
}

export function BlurredImage({ source, isBlurred, lockLabel, style, onUnlockPress }: BlurredImageProps) {
  const { dict } = useAppDict();
  return (
    <View style={[styles.wrapper, style]}>
      <Image source={source} style={styles.image} />
      {isBlurred && (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={styles.overlay} onPress={onUnlockPress}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            <Text style={styles.lockLabel}>{lockLabel ?? dict.profileCard.lockLabel}</Text>
          </Pressable>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.emerald50 },
  image: { width: '100%', height: '100%' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  lockBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: { fontSize: 18 },
  lockLabel: { color: colors.white, fontSize: 13, fontWeight: '600', textAlign: 'center', paddingHorizontal: 12 },
});
