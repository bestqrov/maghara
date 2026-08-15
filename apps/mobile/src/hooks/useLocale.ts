import { useLocaleStore, type Locale } from '@/store/locale.store';
import { dictionaries } from '@/i18n/dictionary';

const RTL_LOCALES: Locale[] = ['ar'];

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}

/**
 * Native RTL (I18nManager.forceRTL) only takes effect after a full app
 * reload, which is a bad UX for a language toggle. Instead we compute
 * direction manually here and every screen/component applies it directly to
 * its own styles (flexDirection/textAlign), giving an immediate, real
 * RTL<->LTR flip per language with no restart required.
 */
export function useAppDict() {
  const locale = useLocale();
  const isRTL = RTL_LOCALES.includes(locale);
  return {
    locale,
    dict: dictionaries[locale],
    isRTL,
    row: (isRTL ? 'row-reverse' : 'row') as 'row-reverse' | 'row',
    textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
    alignEnd: (isRTL ? 'flex-start' : 'flex-end') as 'flex-start' | 'flex-end',
    alignStart: (isRTL ? 'flex-end' : 'flex-start') as 'flex-end' | 'flex-start',
  };
}
