const PHONE_PATTERN = /(\+?\d[\d\s().-]{6,}\d)/;
const SOCIAL_HANDLE_PATTERN =
  /(https?:\/\/\S+)|(\bwww\.\S+)|(@[a-zA-Z0-9_.]{3,})|(\b(whatsapp|telegram|instagram|snapchat|tiktok|facebook|fb\.com|wa\.me)\b)/i;

export function containsContactInfo(text: string): boolean {
  return PHONE_PATTERN.test(text) || SOCIAL_HANDLE_PATTERN.test(text);
}

export function redactContactInfo(text: string): string {
  return text
    .replace(new RegExp(PHONE_PATTERN, 'g'), '[hidden]')
    .replace(new RegExp(SOCIAL_HANDLE_PATTERN, 'gi'), '[hidden]');
}
