import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocaleStore, type Locale } from '@/store/locale.store';
import { useAppDict } from '@/hooks/useLocale';
import { colors } from '@/theme/colors';

const LANGUAGE_META: Record<Locale, { flag: string; nativeName: string }> = {
  ar: { flag: '🇲🇦', nativeName: 'العربية' },
  fr: { flag: '🇫🇷', nativeName: 'Français' },
  en: { flag: '🇬🇧', nativeName: 'English' },
  es: { flag: '🇪🇸', nativeName: 'Español' },
};

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { locale, dict, textAlign, row } = useAppDict();
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, { textAlign }]}>{dict.languageSelector.title}</Text>
          {(Object.keys(LANGUAGE_META) as Locale[]).map((code) => {
            const meta = LANGUAGE_META[code];
            const active = code === locale;
            return (
              <Pressable
                key={code}
                onPress={() => {
                  setLocale(code);
                  onClose();
                }}
                style={[styles.option, { flexDirection: row }, active && styles.optionActive]}
              >
                <Text style={styles.flag}>{meta.flag}</Text>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{meta.nativeName}</Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,46,29,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 320, backgroundColor: colors.white, borderRadius: 24, padding: 12 },
  title: { fontSize: 15, fontWeight: '800', color: colors.emerald700, padding: 12 },
  option: { alignItems: 'center', gap: 10, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12 },
  optionActive: { backgroundColor: colors.emerald50 },
  flag: { fontSize: 18 },
  optionText: { fontSize: 14, color: colors.ink700 },
  optionTextActive: { fontWeight: '700', color: colors.emerald700 },
});
