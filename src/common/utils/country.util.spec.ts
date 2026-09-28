import { canonicalCountry, countryFilter, normalizeCountryInput } from './country.util';

describe('country util', () => {
  it.each(['الكويت', 'كويت', 'Kuwait', 'kuwait ', 'Koweït', 'KW', 'الْكُوَيْت'])('maps %s to الكويت', (input) => {
    expect(canonicalCountry(input)).toBe('الكويت');
  });

  it('folds hamza and "ال" variants', () => {
    expect(canonicalCountry('الامارات')).toBe('الإمارات');
    expect(canonicalCountry('اسبانيا')).toBe('إسبانيا');
    expect(canonicalCountry('UAE')).toBe('الإمارات');
    expect(canonicalCountry('Maroc')).toBe('المغرب');
  });

  it('keeps unknown countries as typed', () => {
    expect(canonicalCountry('Atlantis')).toBeUndefined();
    expect(normalizeCountryInput('  Atlantis ')).toBe('Atlantis');
  });

  it('matches every stored spelling of a known country', () => {
    const { $in } = countryFilter('كويت');
    expect($in.some((re) => re.test('الكويت'))).toBe(true);
    expect($in.some((re) => re.test('Kuwait'))).toBe(true);
    expect($in.some((re) => re.test('قطر'))).toBe(false);
  });
});
