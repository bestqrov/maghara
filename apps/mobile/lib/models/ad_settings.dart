/// Mirrors `AdSettings['placements']` from the old
/// `apps/mobile/src/services/adSettings.service.ts`.
class AdPlacements {
  const AdPlacements({
    required this.bannerHome,
    required this.bannerMatches,
    required this.bannerVisitors,
    required this.interstitialFeed,
    required this.nativeFeed,
    required this.appOpenAd,
  });

  final bool bannerHome;
  final bool bannerMatches;
  final bool bannerVisitors;
  final bool interstitialFeed;
  final bool nativeFeed;
  final bool appOpenAd;

  factory AdPlacements.fromJson(Map<String, dynamic> json) => AdPlacements(
        bannerHome: json['bannerHome'] as bool? ?? false,
        bannerMatches: json['bannerMatches'] as bool? ?? false,
        bannerVisitors: json['bannerVisitors'] as bool? ?? false,
        interstitialFeed: json['interstitialFeed'] as bool? ?? false,
        nativeFeed: json['nativeFeed'] as bool? ?? false,
        appOpenAd: json['appOpenAd'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'bannerHome': bannerHome,
        'bannerMatches': bannerMatches,
        'bannerVisitors': bannerVisitors,
        'interstitialFeed': interstitialFeed,
        'nativeFeed': nativeFeed,
        'appOpenAd': appOpenAd,
      };
}

/// Mirrors `AdSettings` from the old
/// `apps/mobile/src/services/adSettings.service.ts`, returned by
/// `GET /ad-settings`.
class AdSettings {
  const AdSettings({
    required this.active,
    this.admobBannerAdUnitId,
    this.admobInterstitialAdUnitId,
    this.admobNativeAdUnitId,
    this.admobAppOpenAdUnitId,
    required this.interstitialAdInterval,
    required this.nativeAdIndex,
    required this.placements,
  });

  final bool active;
  final String? admobBannerAdUnitId;
  final String? admobInterstitialAdUnitId;
  final String? admobNativeAdUnitId;
  final String? admobAppOpenAdUnitId;
  final int interstitialAdInterval;
  final int nativeAdIndex;
  final AdPlacements placements;

  factory AdSettings.fromJson(Map<String, dynamic> json) => AdSettings(
        active: json['active'] as bool? ?? false,
        admobBannerAdUnitId: json['admobBannerAdUnitId'] as String?,
        admobInterstitialAdUnitId: json['admobInterstitialAdUnitId'] as String?,
        admobNativeAdUnitId: json['admobNativeAdUnitId'] as String?,
        admobAppOpenAdUnitId: json['admobAppOpenAdUnitId'] as String?,
        interstitialAdInterval: (json['interstitialAdInterval'] as num?)?.toInt() ?? 0,
        nativeAdIndex: (json['nativeAdIndex'] as num?)?.toInt() ?? 0,
        placements: AdPlacements.fromJson(json['placements'] as Map<String, dynamic>? ?? const {}),
      );

  Map<String, dynamic> toJson() => {
        'active': active,
        if (admobBannerAdUnitId != null) 'admobBannerAdUnitId': admobBannerAdUnitId,
        if (admobInterstitialAdUnitId != null) 'admobInterstitialAdUnitId': admobInterstitialAdUnitId,
        if (admobNativeAdUnitId != null) 'admobNativeAdUnitId': admobNativeAdUnitId,
        if (admobAppOpenAdUnitId != null) 'admobAppOpenAdUnitId': admobAppOpenAdUnitId,
        'interstitialAdInterval': interstitialAdInterval,
        'nativeAdIndex': nativeAdIndex,
        'placements': placements.toJson(),
      };
}
