import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';
import '../../models/enums.dart';
import '../../models/search_result_profile.dart';
import '../../models/verification_status.dart';
import '../../services/matching_service.dart';
import '../../services/users_service.dart';
import '../../services/verification_service.dart';
import '../../services/visitors_service.dart';
import '../../widgets/nav_bar.dart';
import '../../widgets/verification_banner.dart';
import 'widgets/profile_card.dart';
import 'widgets/search_filters_bar.dart';

/// Discover/home screen: port of the previous Expo app's `app/index.tsx`.
///
/// Ad injection (native ad cards mixed into the feed every N rows) is
/// intentionally NOT ported here — that's wired up end-to-end in a later
/// task. The ad-slot placeholder below the header is a plain seam for it.
class DiscoverScreen extends ConsumerStatefulWidget {
  const DiscoverScreen({super.key});

  @override
  ConsumerState<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends ConsumerState<DiscoverScreen> {
  VerificationStatusResponse? _verification;
  List<SearchResultProfile> _results = const [];
  int _dailyInterestsSent = 0;
  final Set<String> _sentIds = {};
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  Future<void> _init() async {
    ref.read(verificationServiceProvider).getMyVerificationStatus().then((status) {
      if (mounted) setState(() => _verification = status);
    }).catchError((_) {
      if (mounted) setState(() => _verification = null);
    });
    ref.read(usersServiceProvider).getMe().then((me) {
      if (mounted) setState(() => _dailyInterestsSent = me.dailyInterestsSent);
    }).catchError((_) {});
    await _runSearch(const SearchFilters());
  }

  Future<void> _runSearch(SearchFilters filters) async {
    final dict = ref.read(appDictProvider).feed;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await ref.read(matchingServiceProvider).search(filters);
      if (mounted) setState(() => _results = data);
    } catch (_) {
      if (mounted) setState(() => _error = dict.errorSearchFailed);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _handleSendInterest(String receiverId) async {
    final dict = ref.read(appDictProvider).feed;
    try {
      await ref.read(matchingServiceProvider).sendInterest(receiverId);
      if (mounted) {
        setState(() {
          _sentIds.add(receiverId);
          _dailyInterestsSent += 1;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _error = dict.errorSendInterestFailed);
    }
  }

  void _handleView(String id) {
    ref.read(visitorsServiceProvider).recordVisit(id);
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider);
    final user = ref.watch(authStoreProvider).user;

    if (user == null) return const SizedBox.shrink();

    final isVip = user.subscriptionTier == SubscriptionTier.vip || user.subscriptionTier == SubscriptionTier.crossBorderVip;

    // Build rows of 2 profiles each, matching the old app's grid layout.
    final rows = <List<SearchResultProfile>>[];
    for (var i = 0; i < _results.length; i += 2) {
      rows.add(_results.sublist(i, i + 2 > _results.length ? _results.length : i + 2));
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const NavBar(),
            const SizedBox(height: 14),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        dict.feed.greeting(user.profile.firstName),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.emerald700),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${user.profile.currentCity} · ${user.profile.residenceCountry}',
                        style: const TextStyle(fontSize: 13, color: AppColors.ink500),
                      ),
                    ],
                  ),
                ),
                if (!isVip)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(999)),
                    child: Text(
                      dict.feed.interestsToday(_dailyInterestsSent, MatchingService.dailyFreeInterests),
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.emerald700),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 14),
            if (_verification != null) ...[
              VerificationBanner(status: _verification!.verificationStatus),
              const SizedBox(height: 14),
            ],
            // TODO: ad slot, wired in a later task
            const SizedBox.shrink(),
            const SizedBox(height: 14),
            SearchFiltersBar(onSearch: _runSearch, loading: _loading),
            const SizedBox(height: 14),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_error!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: AppColors.red500)),
              ),
            if (_results.isEmpty && !_loading)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Text(dict.feed.noResults, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: AppColors.ink500)),
              ),
            for (final row in rows)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final profile in row) ...[
                      Expanded(
                        child: ProfileCard(
                          key: ValueKey(profile.id),
                          result: profile,
                          onSendInterest: _handleSendInterest,
                          onView: _handleView,
                          sent: _sentIds.contains(profile.id),
                        ),
                      ),
                      if (profile != row.last) const SizedBox(width: 12),
                    ],
                    if (row.length == 1) const Expanded(child: SizedBox.shrink()),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
