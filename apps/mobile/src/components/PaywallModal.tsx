import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors } from '@/theme/colors';
import { UNLOCK_COIN_COST } from '@/services/chat.service';
import { useAppDict } from '@/hooks/useLocale';

interface PaywallModalProps {
  visible: boolean;
  onUnlockWithCoins: () => void;
  onUpgradeVip: () => void;
  onClose: () => void;
  loading: boolean;
}

export function PaywallModal({ visible, onUnlockWithCoins, onUpgradeVip, onClose, loading }: PaywallModalProps) {
  const { dict } = useAppDict();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>💬</Text>
          </View>
          <Text style={styles.title}>{dict.paywallModal.title}</Text>
          <Text style={styles.subtitle}>{dict.paywallModal.body(UNLOCK_COIN_COST)}</Text>

          <View style={{ gap: 10, width: '100%', marginTop: 16 }}>
            <Button variant="gold" onPress={onUpgradeVip} disabled={loading}>
              {dict.paywallModal.upgradeVip}
            </Button>
            <Button loading={loading} onPress={onUnlockWithCoins}>
              {dict.paywallModal.unlockWithCoins(UNLOCK_COIN_COST)}
            </Button>
            <Button variant="ghost" onPress={onClose} disabled={loading}>
              {dict.paywallModal.close}
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
