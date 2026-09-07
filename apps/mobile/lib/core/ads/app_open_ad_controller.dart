import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../models/ad_settings.dart';
import '../ad_settings_provider.dart';

/// Port of the previous Expo app's `src/hooks/useAppOpenAd.ts`.
///
/// Loads and shows a Google-recommended app-open ad on cold start and
/// whenever the app returns from the background, gated on the `appOpenAd`
/// placement flag and an app-open ad unit id being configured. Instantiate
/// once (see `appOpenAdControllerProvider`) and keep it alive for the whole
/// app session; call [dispose] when the app is torn down (not normally
/// needed in practice since the provider outlives the app).
class AppOpenAdController with WidgetsBindingObserver {
  AppOpenAdController(this._ref) {
    WidgetsBinding.instance.addObserver(this);
    _ref.listen<AsyncValue<AdSettings?>>(adSettingsProvider, (previous, next) {
      final settings = next.valueOrNull;
      if (settings == null) return;
      _settings = settings;
      if (!_shownOnce) {
        _shownOnce = true;
        _loadAndShow();
      }
    }, fireImmediately: true);
  }

  final Ref _ref;
  AdSettings? _settings;
  AppOpenAd? _ad;
  bool _shownOnce = false;
  bool _isLoadingOrShowing = false;

  bool get _isEligible {
    final settings = _settings;
    if (settings == null) return false;
    final unitId = settings.admobAppOpenAdUnitId;
    return settings.active && settings.placements.appOpenAd && unitId != null && unitId.isEmpty == false;
  }

  void _loadAndShow() {
    final settings = _settings;
    if (settings == null || !_isEligible || _isLoadingOrShowing) return;
    final unitId = settings.admobAppOpenAdUnitId!;
    _isLoadingOrShowing = true;
    AppOpenAd.load(
      adUnitId: unitId,
      request: const AdRequest(),
      adLoadCallback: AppOpenAdLoadCallback(
        onAdLoaded: (ad) {
          _ad = ad;
          ad.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _ad = null;
              _isLoadingOrShowing = false;
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              ad.dispose();
              _ad = null;
              _isLoadingOrShowing = false;
            },
          );
          ad.show();
        },
        onAdFailedToLoad: (error) {
          _isLoadingOrShowing = false;
        },
      ),
    );
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _ad == null && !_isLoadingOrShowing) {
      _loadAndShow();
    }
  }

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _ad?.dispose();
  }
}

/// Kept alive for the whole app session (see `main.dart`, where reading
/// this provider once near startup is what actually instantiates the
/// controller and starts the cold-start ad load/show).
final appOpenAdControllerProvider = Provider<AppOpenAdController>((ref) {
  final controller = AppOpenAdController(ref);
  ref.onDispose(controller.dispose);
  return controller;
});
