import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurredImage } from './BlurredImage';
import { colors } from '@/theme/colors';
import { SearchResultProfile } from '@/services/matching.service';

function calculateAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

interface ProfileCardProps {
  result: SearchResultProfile;
  onSendInterest: (id: string) => void;
  onView?: (id: string) => void;
  sent: boolean;
}

export function ProfileCard({ result, onSendInterest, onView, sent }: ProfileCardProps) {
  const { profile } = result;
  const photoUri = profile.photos[0] ?? 'https://placehold.co/400x500/eef6f0/2f7a52?text=Zawaj';

  return (
    <Pressable onPress={() => !result.blurred && onView?.(result._id)} style={styles.card}>
      <BlurredImage
        source={{ uri: photoUri }}
        isBlurred={result.blurred}
        style={styles.image}
        lockLabel="فتح بالنقط أو VIP"
      />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {result.blurred ? '••••••' : profile.firstName}, {calculateAge(profile.birthDate)}
          </Text>
          {result.isVerified && <Text style={styles.badge}>🛡️</Text>}
        </View>
        <Text style={styles.location}>
          {profile.currentCity} · {profile.residenceCountry}
        </Text>

        <Pressable
          disabled={result.blurred || sent}
          onPress={() => onSendInterest(result._id)}
          style={[styles.button, (result.blurred || sent) && styles.buttonDisabled]}
        >
          <Text style={[styles.buttonText, (result.blurred || sent) && styles.buttonTextDisabled]}>
            {sent ? 'تم الإرسال ✓' : 'إبعث اهتمام'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.white, borderRadius: 22, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 4 / 5 },
  body: { padding: 12, gap: 4 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: colors.emerald900 },
  badge: { fontSize: 12 },
  location: { fontSize: 12, color: colors.ink500, textAlign: 'right' },
  button: { marginTop: 8, backgroundColor: colors.emerald600, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: colors.emerald100 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  buttonTextDisabled: { color: colors.emerald500 },
});
