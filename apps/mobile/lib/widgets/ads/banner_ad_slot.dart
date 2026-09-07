import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../core/ad_settings_provider.dart';
import '../../models/ad_settings.dart';

/// The three banner placements the remote ad config knows about. Mirrors
/// the `Placement` union type in the old
/// `apps/mobile/src/components/ads/BannerAdSlot.tsx`.
enum BannerPlacement { bannerHome, bannerMatches, bannerVisitors }

bool _isEnabled(AdSettings settings, BannerPlacement placement) {
  switch (placement) {
    case BannerPlacement.bannerHome:
      return settings.placements.bannerHome;
    case BannerPlacement.bannerMatches:
      return settings.placements.bannerMatches;
    case BannerPlacement.bannerVisitors:
      return settings.placements.bannerVisitors;
  }
}

/// Port of the previous Expo app's `src/components/ads/BannerAdSlot.tsx`.
///
/// Reads the cached [adSettingsProvider] result and, only if ads are active,
/// this [placement] is enabled, and a banner ad unit id is configured,
/// mounts a real Google `BannerAd`. Renders nothing in every other case
/// (including while the settings are still loading) so it's a safe no-op
/// seam to drop into any screen.
class BannerAdSlot extends ConsumerWidget {
  const BannerAdSlot({super.key, required this.placement});

  final BannerPlacement placement;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adSettings = ref.watch(adSettingsProvider);

    return adSettings.when(
      data: (settings) {
        if (settings == null || !settings.active || !_isEnabled(settings, placement)) {
          return const SizedBox.shrink();
        }
        final unitId = settings.admobBannerAdUnitId;
        if (unitId == null || unitId.isEmpty) return const SizedBox.shrink();

        return _BannerAdView(key: ValueKey('$placement-$unitId'), unitId: unitId);
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}

class _BannerAdView extends StatefulWidget {
  const _BannerAdView({super.key, required this.unitId});

  final String unitId;

  @override
  State<_BannerAdView> createState() => _BannerAdViewState();
}

class _BannerAdViewState extends State<_BannerAdView> {
  BannerAd? _bannerAd;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    final ad = BannerAd(
      adUnitId: widget.unitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (_) {
          if (mounted) setState(() => _loaded = true);
        },
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
        },
      ),
    );
    _bannerAd = ad;
    ad.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ad = _bannerAd;
    if (!_loaded || ad == null) return const SizedBox.shrink();

    return Container(
      alignment: Alignment.center,
      margin: const EdgeInsets.symmetric(vertical: 8),
      width: ad.size.width.toDouble(),
      height: ad.size.height.toDouble(),
      child: AdWidget(ad: ad),
    );
  }
}
