import { forwardRef, SelectHTMLAttributes } from 'react';
import countries from '@/data/countries.json';
import { Select } from './ui/Select';
import type { Locale } from '@/lib/seo';

interface CountrySelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  locale: Locale;
  label?: string;
  error?: string;
  /** Label of the empty first option (e.g. "Choose a country" / "All countries"). */
  placeholder: string;
  /** A saved value that is not in the list (an older free-text entry), kept selectable so it isn't lost. */
  currentValue?: string;
}

/**
 * Country dropdown. The submitted value is always the canonical Arabic name
 * the backend stores (see `src/common/data/countries.data.ts`); only the
 * visible label follows the locale.
 */
export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(function CountrySelect(
  { locale, placeholder, currentValue, ...props },
  ref,
) {
  const options = countries.map((c) => ({ value: c.ar, label: c[locale] ?? c.ar }));
  if (currentValue && !options.some((o) => o.value === currentValue)) {
    options.unshift({ value: currentValue, label: currentValue });
  }
  return <Select ref={ref} options={[{ value: '', label: placeholder }, ...options]} {...props} />;
});
