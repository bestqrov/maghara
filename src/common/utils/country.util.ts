import { COUNTRIES, CountryEntry } from '../data/countries.data';

/**
 * Folds the ways one country name gets typed into a single lookup key:
 * case, accents/harakat, hamza and taa-marbuta variants, a leading "ال",
 * and spacing/punctuation. "الكويت", "كويت", "Kuwait" and "Koweït" all map
 * to the same entry.
 */
function countryKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ًͯ-ٰٟ]/g, '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim()
    .replace(/^ال/, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function spellings(country: CountryEntry): string[] {
  return [
    country.ar,
    country.en,
    country.fr,
    country.es,
    country.code,
    ...country.aliases,
  ];
}

const COUNTRY_BY_KEY = new Map<string, CountryEntry>();
for (const country of COUNTRIES) {
  for (const spelling of spellings(country)) {
    COUNTRY_BY_KEY.set(countryKey(spelling), country);
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The canonical (Arabic) name for any known spelling, or undefined for an unknown country. */
export function canonicalCountry(value: string): string | undefined {
  return COUNTRY_BY_KEY.get(countryKey(value))?.ar;
}

/** What to store for a user-entered country: the canonical name when known, otherwise the trimmed input. */
export function normalizeCountryInput(value: string): string {
  return canonicalCountry(value) ?? value.trim();
}

/**
 * Mongo condition matching a country field against any known spelling of
 * `value`, so profiles saved before normalization still match.
 */
export function countryFilter(value: string) {
  const country = COUNTRY_BY_KEY.get(countryKey(value));
  const values = country ? spellings(country) : [value.trim()];
  return {
    $in: values.map((v) => new RegExp(`^\\s*${escapeRegex(v)}\\s*$`, 'i')),
  };
}
