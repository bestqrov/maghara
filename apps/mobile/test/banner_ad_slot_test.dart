// Widget test for BannerAdSlot: verifies it renders nothing (no real AdMob
// call attempted) when the remote ad settings say ads are off, and again
// when this specific placement is disabled — the two "safe no-op" cases
// that don't require a real ad request, so they're the only ones testable
// without touching the network.

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:app/models/ad_settings.dart';
import 'package:app/services/ad_settings_service.dart';
import 'package:app/widgets/ads/banner_ad_slot.dart';

class _StaticAdSettingsService extends AdSettingsService {
  _StaticAdSettingsService(this._settings) : super(Dio());

  final AdSettings _settings;

  @override
  Future<AdSettings> getAdSettings() async => _settings;
}

const _allDisabled = AdSettings(
  active: false,
  admobBannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdInterval: 5,
  nativeAdIndex: 5,
  placements: AdPlacements(
    bannerHome: true,
    bannerMatches: true,
    bannerVisitors: true,
    interstitialFeed: true,
    nativeFeed: true,
    appOpenAd: true,
  ),
);

const _placementOff = AdSettings(
  active: true,
  admobBannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdInterval: 5,
  nativeAdIndex: 5,
  placements: AdPlacements(
    bannerHome: false,
    bannerMatches: false,
    bannerVisitors: false,
    interstitialFeed: false,
    nativeFeed: false,
    appOpenAd: false,
  ),
);

Future<void> _pumpSlot(WidgetTester tester, AdSettings settings) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [adSettingsServiceProvider.overrideWithValue(_StaticAdSettingsService(settings))],
      child: const MaterialApp(
        home: Scaffold(body: BannerAdSlot(placement: BannerPlacement.bannerHome)),
      ),
    ),
  );
  for (var i = 0; i < 5; i++) {
    await tester.pump(const Duration(milliseconds: 20));
  }
}

void main() {
  testWidgets('renders nothing when ads are globally inactive', (tester) async {
    await _pumpSlot(tester, _allDisabled);

    expect(find.byType(BannerAdSlot), findsOneWidget);
    final slot = tester.widget<BannerAdSlot>(find.byType(BannerAdSlot));
    expect(slot, isNotNull);
    // No platform view / AdWidget should ever be built.
    expect(find.byWidgetPredicate((w) => w.runtimeType.toString() == 'AdWidget'), findsNothing);
  });

  testWidgets('renders nothing when this placement is disabled', (tester) async {
    await _pumpSlot(tester, _placementOff);

    expect(find.byWidgetPredicate((w) => w.runtimeType.toString() == 'AdWidget'), findsNothing);
  });
}
