/// Compile-time app configuration constants.
///
/// Mirrors the values previously stored in the Expo app's `app.json` /
/// `extra` block. These are constants (not environment-configurable yet)
/// because the mobile app currently only targets a single backend.
class AppConfig {
  AppConfig._();

  /// Backend REST API base URL.
  static const String apiUrl = 'https://api.9issmaonassib.com';

  /// Realtime (socket.io) server base URL.
  static const String socketUrl = 'https://api.9issmaonassib.com';

  /// Public marketing / payments website URL.
  static const String websiteUrl = 'https://9issmaonassib.com';

  /// Cloudinary unsigned upload configuration.
  static const String cloudinaryCloudName = 'dysrmslea';
  static const String cloudinaryUploadPreset = 'zawajrecepte';

  /// Native application identifier (Android package / iOS bundle id).
  static const String bundleId = 'com.qismawanasib.app';

  // ---------------------------------------------------------------------
  // AdMob
  // ---------------------------------------------------------------------
  //
  // These are Google's well-known *test* IDs. They must be swapped for the
  // real production IDs before release, but are safe to ship in development
  // and are the same test IDs the previous Expo app used.

  static const String adMobAndroidAppId = 'ca-app-pub-3940256099942544~3347511713';
  static const String adMobIosAppId = 'ca-app-pub-3940256099942544~1458002511';

  // Test ad unit ids (Google public test units).
  static const String adMobBannerAndroidUnitId = 'ca-app-pub-3940256099942544/6300978111';
  static const String adMobBannerIosUnitId = 'ca-app-pub-3940256099942544/2934735716';

  static const String adMobInterstitialAndroidUnitId = 'ca-app-pub-3940256099942544/1033173712';
  static const String adMobInterstitialIosUnitId = 'ca-app-pub-3940256099942544/4411468910';

  static const String adMobNativeAndroidUnitId = 'ca-app-pub-3940256099942544/2247696110';
  static const String adMobNativeIosUnitId = 'ca-app-pub-3940256099942544/3986624511';

  static const String adMobAppOpenAndroidUnitId = 'ca-app-pub-3940256099942544/9257395921';
  static const String adMobAppOpenIosUnitId = 'ca-app-pub-3940256099942544/5575463023';
}
