import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors } from '@/theme/colors';
import { UNLOCK_COIN_COST } from '@/services/chat.service';

interface PaywallModalProps {
  visible: boolean;
  onUnlockWithCoins: () => void;
  onUpgradeVip: () => void;
  onClose: () => void;
  loading: boolean;
}

export function PaywallModal({ visible, onUnlockWithCoins, onUpgradeVip, onClose, loading }: PaywallModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>💬</Text>
          </View>
          <Text style={styles.title}>وصلتي لمرحلة مهمة!</Text>
          <Text style={styles.subtitle}>
            باش تكمل الشات بسلاسة، فتحو بـ {UNLOCK_COIN_COST} نقط أو ترقى لـ VIP للشات بلا حدود
          </Text>

          <View style={{ gap: 10, width: '100%', marginTop: 16 }}>
            <Button variant="gold" onPress={onUpgradeVip} disabled={loading}>
              ترقى لـ VIP
            </Button>
            <Button loading={loading} onPress={onUnlockWithCoins}>
              {`فتح بـ ${UNLOCK_COIN_COST} نقط`}
            </Button>
            <Button variant="ghost" onPress={onClose} disabled={loading}>
              إغلاق
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,46,29,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 340, backgroundColor: colors.white, borderRadius: 28, padding: 24, alignItems: 'center' },
  badge: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.gold100, alignItems: 'center', justifyContent: 'center' },
  badgeIcon: { fontSize: 24 },
  title: { fontSize: 17, fontWeight: '800', color: colors.emerald700, marginTop: 12, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'center', marginTop: 6 },
});
