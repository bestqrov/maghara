// Widget test for DiscoverScreen: verifies that a fetched profile list
// renders as ProfileCards, using mocked matching/users/verification/visitors
// services so no real network is touched.

import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/features/discover/discover_screen.dart';
import 'package:app/features/discover/widgets/profile_card.dart';
import 'package:app/models/ad_settings.dart';
import 'package:app/models/auth_user.dart';
import 'package:app/models/enums.dart';
import 'package:app/models/match_entry.dart';
import 'package:app/models/search_result_profile.dart';
import 'package:app/models/verification_status.dart';
import 'package:app/models/visitor_entry.dart';
import 'package:app/services/ad_settings_service.dart';
import 'package:app/services/matching_service.dart';
import 'package:app/services/users_service.dart';
import 'package:app/services/verification_service.dart';
import 'package:app/services/visitors_service.dart';

const _me = AuthUser(
  id: 'me1',
  phoneNumber: '+212600000000',
  subscriptionTier: SubscriptionTier.free,
  profile: UserProfile(
    firstName: 'Sara',
    gender: Gender.female,
    birthDate: '1998-01-01',
    residenceCountry: 'Morocco',
    currentCity: 'Casablanca',
    originCountry: 'Morocco',
    relocationPreference: RelocationPreference.localOnly,
    photos: [],
    isPhotoBlurred: false,
  ),
);

final _profile1 = SearchResultProfile(
  id: 'p1',
  isVerified: true,
  verificationStatus: 'VERIFIED',
  subscriptionTier: 'FREE',
  blurred: false,
  profile: const SearchResultProfileDetails(
    firstName: 'Yasmine',
    gender: Gender.female,
    birthDate: '1996-05-01',
    residenceCountry: 'Morocco',
    currentCity: 'Rabat',
    originCountry: 'Morocco',
    relocationPreference: RelocationPreference.openToMove,
    photos: [],
  ),
);

final _profile2 = SearchResultProfile(
  id: 'p2',
  isVerified: false,
  verificationStatus: 'UNVERIFIED',
  subscriptionTier: 'FREE',
  blurred: true,
  profile: const SearchResultProfileDetails(
    firstName: 'Nadia',
    gender: Gender.female,
    birthDate: '1994-05-01',
    residenceCountry: 'Morocco',
    currentCity: 'Fes',
    originCountry: 'Morocco',
    relocationPreference: RelocationPreference.localOnly,
    photos: [],
  ),
);

class _FakeMatchingService extends MatchingService {
  _FakeMatchingService() : super(Dio());

  @override
  Future<List<SearchResultProfile>> search(SearchFilters filters) async => [_profile1, _profile2];

  @override
  Future<void> sendInterest(String receiverId, {bool isSuperLike = false}) async {}

  @override
  Future<List<MatchEntry>> getMyMatches() async => const [];
}

class _FakeUsersService extends UsersService {
  _FakeUsersService() : super(Dio());

  @override
  Future<FullUser> getMe() async => FullUser(
        id: _me.id,
        phoneNumber: _me.phoneNumber,
        subscriptionTier: _me.subscriptionTier,
        profile: _me.profile,
        coinBalance: 0,
        dailyInterestsSent: 2,
        isVerified: true,
        verificationStatus: 'VERIFIED',
      );
}

class _FakeVerificationService extends VerificationService {
  _FakeVerificationService() : super(Dio());

  @override
  Future<VerificationStatusResponse> getMyVerificationStatus() async => const VerificationStatusResponse(
        isVerified: true,
        verificationStatus: VerificationStatusValue.verified,
      );
}

class _FakeVisitorsService extends VisitorsService {
  _FakeVisitorsService() : super(Dio());

  @override
  Future<void> recordVisit(String profileId) async {}

  @override
  Future<List<VisitorEntry>> getMyVisitors() async => const [];
}

/// Ads switched off entirely, so the banner slot and native-ad row injection
/// both render nothing — no real AdMob call is ever attempted in this test.
class _AllAdsOffSettingsService extends AdSettingsService {
  _AllAdsOffSettingsService() : super(Dio());

  @override
  Future<AdSettings> getAdSettings() async => const AdSettings(
        active: false,
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
}

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({
      'zawaj-auth': jsonEncode({'token': 'tok-123', 'user': _me.toJson()}),
    });
  });

  testWidgets('renders a fetched profile list as ProfileCards', (tester) async {
    final router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(path: '/', builder: (context, state) => const DiscoverScreen()),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          matchingServiceProvider.overrideWithValue(_FakeMatchingService()),
          usersServiceProvider.overrideWithValue(_FakeUsersService()),
          verificationServiceProvider.overrideWithValue(_FakeVerificationService()),
          visitorsServiceProvider.overrideWithValue(_FakeVisitorsService()),
          adSettingsServiceProvider.overrideWithValue(_AllAdsOffSettingsService()),
        ],
        child: MaterialApp.router(routerConfig: router),
      ),
    );

    // Let hydration, the post-frame init, and the fake async service calls
    // all settle.
    for (var i = 0; i < 10; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.byType(ProfileCard), findsNWidgets(2));
    expect(find.textContaining('Yasmine'), findsOneWidget);
    expect(find.textContaining('••••••'), findsOneWidget);
  });
}
