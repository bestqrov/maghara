import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BANK_DETAILS,
  createTransaction,
  CRYPTO_WALLETS,
  PaymentMethod,
  TransactionType,
} from '@/services/payments.service';
import { Button } from './Button';
import { Input } from './Input';
import { colors } from '@/theme/colors';

const METHODS: { value: PaymentMethod; label: string; kind: 'crypto' | 'manual' }[] = [
  { value: 'CRYPTO_TRC20', label: 'USDT (TRC-20)', kind: 'crypto' },
  { value: 'CRYPTO_POLYGON', label: 'USDT (Polygon)', kind: 'crypto' },
  { value: 'CRYPTO_SOLANA', label: 'USDT (Solana)', kind: 'crypto' },
  { value: 'BANK_TRANSFER', label: 'تحويل بنكي', kind: 'manual' },
  { value: 'CASH_PLUS', label: 'Cash Plus', kind: 'manual' },
];

interface PaymentModalProps {
  visible: boolean;
  amount: number;
  type: TransactionType;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ visible, amount, type, title, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const selected = METHODS.find((m) => m.value === method);

  function reset() {
    setMethod(null);
    setReference('');
    setError(null);
    setDone(false);
  }

  async function handleSubmit() {
    if (!method || !reference.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTransaction({ amount, currency: 'MAD', paymentMethod: method, type, txHashOrReceipt: reference.trim() });
      setDone(true);
      onSuccess();
    } catch {
      setError('كاين مشكل، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        reset();
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {done ? (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.successBadge}>
                <Text style={{ fontSize: 22 }}>✓</Text>
              </View>
              <Text style={styles.title}>صيفطنا طلبك للمراجعة</Text>
              <Text style={styles.subtitle}>غادي نأكدو العملية ونفعلو الخدمة قريباً</Text>
              <Button
                onPress={() => {
                  reset();
                  onClose();
                }}
                style={{ width: '100%', marginTop: 16 }}
              >
                تمام
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>اختار طريقة الدفع</Text>

              <View style={{ gap: 8, marginTop: 12 }}>
                {METHODS.map((m) => {
                  const active = method === m.value;
                  return (
                    <Pressable
                      key={m.value}
                      onPress={() => {
                        setMethod(m.value);
                        setReference('');
                      }}
                      style={[styles.methodBtn, active && styles.methodBtnActive]}
                    >
                      <Text style={[styles.methodText, active && styles.methodTextActive]}>{m.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {selected && selected.kind === 'crypto' && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>صيفط {amount} MAD (USDT) لهاد العنوان:</Text>
                  <Text style={styles.infoMono}>{CRYPTO_WALLETS[selected.value]}</Text>
                  <Text style={styles.warning}>⚠️ هاد العنوان placeholder ديمو، خاصو يتبدل قبل الإطلاق</Text>
                </View>
              )}

              {selected && selected.kind === 'manual' && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>حوّل {amount} MAD لـ:</Text>
                  <Text style={styles.infoBank}>{BANK_DETAILS[selected.value].bank}</Text>
                  <Text style={styles.infoMono}>{BANK_DETAILS[selected.value].rib}</Text>
                  <Text style={styles.warning}>⚠️ هادو معطيات placeholder — خاصهم يتبدلو قبل الإطلاق</Text>
                </View>
              )}

              {selected && (
                <View style={{ marginTop: 12, width: '100%' }}>
                  <Input
                    label={selected.kind === 'crypto' ? 'TxHash' : 'رابط صورة الوصل'}
                    value={reference}
                    onChangeText={setReference}
                    placeholder={selected.kind === 'crypto' ? '0x...' : 'https://...'}
                  />
                </View>
              )}

              {error && <Text style={styles.error}>{error}</Text>}

              <View style={{ flexDirection: 'row-reverse', gap: 10, marginTop: 16, width: '100%' }}>
                <Button
                  variant="ghost"
                  onPress={() => {
                    reset();
                    onClose();
                  }}
                  style={{ flex: 1 }}
                >
                  إغلاق
                </Button>
                <Button onPress={handleSubmit} loading={loading} disabled={!method || !reference.trim()} style={{ flex: 1 }}>
                  تأكيد
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,46,29,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 360, backgroundColor: colors.white, borderRadius: 24, padding: 20, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.emerald700, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.ink500, textAlign: 'center', marginTop: 4 },
  successBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.emerald50, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  methodBtn: { borderWidth: 1, borderColor: colors.emerald100, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, width: '100%' },
  methodBtnActive: { borderColor: colors.emerald500, backgroundColor: colors.emerald50 },
  methodText: { fontSize: 13, color: colors.ink700, textAlign: 'right' },
  methodTextActive: { color: colors.emerald700, fontWeight: '700' },
  infoBox: { width: '100%', backgroundColor: colors.gold100, borderRadius: 14, padding: 12, marginTop: 12 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: colors.emerald900, textAlign: 'right' },
  infoBank: { fontSize: 12, color: colors.emerald700, textAlign: 'right', marginTop: 4 },
  infoMono: { fontSize: 12, color: colors.emerald700, backgroundColor: colors.white, padding: 8, borderRadius: 8, marginTop: 6, textAlign: 'left' },
  warning: { fontSize: 11, color: '#dc2626', marginTop: 8, textAlign: 'right' },
  error: { fontSize: 13, color: colors.red500, textAlign: 'center', marginTop: 8 },
});
