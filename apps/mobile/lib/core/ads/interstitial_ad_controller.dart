import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../models/ad_settings.dart';
import '../ad_settings_provider.dart';

/// Port of the previous Expo app's `src/hooks/useInterstitialAd.ts`.
///
/// Preloads an [InterstitialAd] once ad settings say the `interstitialFeed`
/// placement is on, then exposes [notifyAction] — call it after each unit of
/// activity (e.g. a profile viewed); every `interstitialAdInterval` calls the
/// preloaded ad is shown and a new one starts loading immediately so there's
/// rarely a wait.
class InterstitialAdController {
  InterstitialAdController(this._ref) {
    _ref.listen<AsyncValue<AdSettings?>>(adSettingsProvider, (previous, next) {
      final settings = next.valueOrNull;
      if (settings == null) return;
      _maybeStartLoading(settings);
    }, fireImmediately: true);
  }

  final Ref _ref;

  InterstitialAd? _ad;
  bool _loaded = false;
  int _counter = 0;
  bool _started = false;
  AdSettings? _settings;

  void _maybeStartLoading(AdSettings settings) {
    _settings = settings;
    if (_started) return;
    final unitId = settings.admobInterstitialAdUnitId;
    if (!settings.active || !settings.placements.interstitialFeed || unitId == null || unitId.isEmpty) {
      return;
    }
    _started = true;
    _load(unitId);
  }

  void _load(String unitId) {
    _loaded = false;
    InterstitialAd.load(
      adUnitId: unitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _ad = ad;
          _loaded = true;
          ad.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _ad = null;
              _load(unitId);
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              ad.dispose();
              _ad = null;
              _load(unitId);
            },
          );
        },
        onAdFailedToLoad: (error) {
          _loaded = false;
        },
      ),
    );
  }

  /// Call after each unit of feed activity. Shows the preloaded interstitial
  /// every `interstitialAdInterval` calls, gated on the placement flag.
  void notifyAction() {
    final settings = _settings;
    if (settings == null || !settings.active || !settings.placements.interstitialFeed) return;
    _counter += 1;
    if (_counter < settings.interstitialAdInterval) return;
    _counter = 0;
    final ad = _ad;
    if (_loaded && ad != null) {
      _loaded = false;
      ad.show();
    }
  }

  void dispose() {
    _ad?.dispose();
  }
}

final interstitialAdControllerProvider = Provider<InterstitialAdController>((ref) {
  final controller = InterstitialAdController(ref);
  ref.onDispose(controller.dispose);
  return controller;
});
