import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Factory id the platform side (see `android/app/.../ListTileNativeAdFactory.kt`)
/// registers itself under via `GoogleMobileAdsPlugin.registerNativeAdFactory`.
const String nativeAdFactoryId = 'profileCardNativeAd';

/// Port of the previous Expo app's `src/components/ads/NativeAdCard.tsx`.
///
/// Loads a Google `NativeAd` for [unitId] and renders it via a platform
/// view built by the native ad factory registered under
/// [nativeAdFactoryId], sized to fill the same grid slot a `ProfileCard`
/// occupies in the discover feed so it drops in without a layout refactor.
class NativeAdCard extends StatefulWidget {
  const NativeAdCard({super.key, required this.unitId});

  final String unitId;

  @override
  State<NativeAdCard> createState() => _NativeAdCardState();
}

class _NativeAdCardState extends State<NativeAdCard> {
  NativeAd? _nativeAd;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    final ad = NativeAd(
      adUnitId: widget.unitId,
      factoryId: nativeAdFactoryId,
      request: const AdRequest(),
      listener: NativeAdListener(
        onAdLoaded: (_) {
          if (mounted) setState(() => _loaded = true);
        },
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
        },
      ),
    );
    _nativeAd = ad;
    ad.load();
  }

  @override
  void dispose() {
    _nativeAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ad = _nativeAd;
    if (!_loaded || ad == null) return const SizedBox.shrink();

    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: AspectRatio(
        aspectRatio: 4 / 5.5,
        child: AdWidget(ad: ad),
      ),
    );
  }
}
