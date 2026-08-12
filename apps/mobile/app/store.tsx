import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { COIN_PACKAGES, getMyTransactions, Transaction, TransactionType, VIP_PLAN } from '@/services/payments.service';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { PaymentModal } from '@/components/PaymentModal';
import { colors } from '@/theme/colors';

const STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  PENDING: { label: 'فـ الانتظار', bg: colors.gold100, fg: colors.emerald900 },
  SUCCESS: { label: 'تأكدت ✓', bg: colors.emerald50, fg: colors.emerald700 },
  FAILED: { label: 'مرفوضة', bg: colors.rose100, fg: '#dc2626' },
};

const TYPE_LABEL: Record<string, string> = {
  COIN_PURCHASE: 'شحن نقط',
  VIP_SUBSCRIPTION: 'اشتراك VIP',
  VERIFICATION_FEE: 'توثيق',
};

export default function StoreScreen() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modal, setModal] = useState<{ amount: number; type: TransactionType; title: string } | null>(null);

  async function refresh() {
    setTransactions(await getMyTransactions());
  }

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }
    refresh();
  }, [token, hasHydrated]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={transactions}
      keyExtractor={(t) => t._id}
      ListHeaderComponent={
        <View style={{ gap: 14, marginBottom: 8 }}>
          <NavBar />
          <Text style={styles.title}>المتجر والباقات</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>باقات النقط</Text>
            <View style={styles.coinsRow}>
              {COIN_PACKAGES.map((pkg) => (
                <View key={pkg.coins} style={styles.coinPkg}>
                  <Text style={styles.coinAmount}>🪙 {pkg.coins}</Text>
                  <Text style={styles.coinPrice}>{pkg.priceLabel}</Text>
                  <Button
                    variant="gold"
                    onPress={() => setModal({ amount: pkg.coins, type: 'COIN_PURCHASE', title: `شحن ${pkg.coins} نقط` })}
                  >
                    شحن
                  </Button>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.vipCard}>
            <Text style={styles.vipTitle}>{VIP_PLAN.label} 👑</Text>
            <Text style={styles.vipSubtitle}>شات بلا حدود، شوف جميع الزوار، وأولوية فـ الظهور</Text>
            <Text style={styles.vipPrice}>{VIP_PLAN.priceLabel}</Text>
            <Button
              variant="gold"
              onPress={() => setModal({ amount: VIP_PLAN.amount, type: 'VIP_SUBSCRIPTION', title: 'اشتراك VIP' })}
            >
              ترقى دابا
            </Button>
          </View>

          <Text style={styles.cardTitle}>سجل العمليات</Text>
          {transactions.length === 0 && <Text style={styles.empty}>ماكاين حتى عملية دابا</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txType}>{TYPE_LABEL[item.type]}</Text>
            <Text style={styles.txAmount}>
              {item.amount} {item.currency}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_LABEL[item.status].bg }]}>
            <Text style={[styles.statusText, { color: STATUS_LABEL[item.status].fg }]}>
              {STATUS_LABEL[item.status].label}
            </Text>
          </View>
        </View>
      )}
      ListFooterComponent={
        modal ? (
          <PaymentModal
            visible
            amount={modal.amount}
            type={modal.type}
            title={modal.title}
            onClose={() => setModal(null)}
            onSuccess={refresh}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 10 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700, textAlign: 'right' },
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.emerald900, textAlign: 'right' },
  coinsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  coinPkg: { flex: 1, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.emerald100, borderRadius: 16, padding: 10 },
  coinAmount: { fontSize: 15, fontWeight: '800', color: colors.emerald700 },
  coinPrice: { fontSize: 11, color: colors.ink500 },
  vipCard: { backgroundColor: colors.emerald900, borderRadius: 22, padding: 16, gap: 4 },
  vipTitle: { fontSize: 15, fontWeight: '800', color: colors.white, textAlign: 'right' },
  vipSubtitle: { fontSize: 12, color: colors.emerald100, textAlign: 'right' },
  vipPrice: { fontSize: 16, fontWeight: '800', color: colors.gold300, textAlign: 'right', marginBottom: 6 },
  empty: { fontSize: 13, color: colors.ink500, textAlign: 'center', paddingVertical: 12 },
  txRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, padding: 12, marginBottom: 8 },
  txType: { fontSize: 13, fontWeight: '600', color: colors.ink700, textAlign: 'right' },
  txAmount: { fontSize: 12, color: colors.ink500, textAlign: 'right', marginTop: 2 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
