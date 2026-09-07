import '../core/config.dart';

/// Port of `apps/mobile/src/services/website.ts`.
///
/// Builds a locale-prefixed URL into the marketing/payments website, e.g.
/// `websiteUrl('ar', '/vip')` -> `https://9issmaonassib.com/ar/vip`.
String websiteUrl(String locale, String path) {
  return '${AppConfig.websiteUrl}/$locale$path';
}
