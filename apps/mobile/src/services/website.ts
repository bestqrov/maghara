import Constants from 'expo-constants';

const WEBSITE_URL =
  (Constants.expoConfig?.extra?.websiteUrl as string | undefined) ??
  'https://9issmaonassib.com';

export function websiteUrl(locale: string, path: string) {
  return `${WEBSITE_URL}/${locale}${path}`;
}
