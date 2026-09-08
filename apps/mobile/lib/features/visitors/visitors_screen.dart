import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/theme/colors.dart';
import '../../models/visitor_entry.dart';
import '../../services/visitors_service.dart';
import '../../widgets/ads/banner_ad_slot.dart';
import '../../widgets/blurred_image.dart';
import '../../widgets/icon_badge.dart';
import '../../widgets/nav_bar.dart';

const String _placeholderPhoto =
    'https://placehold.co/300x300/eef6f0/2f7a52?text=Zawaj';

/// Port of the previous Expo app's `app/visitors.tsx`.
class VisitorsScreen extends ConsumerStatefulWidget {
  const VisitorsScreen({super.key});

  @override
  ConsumerState<VisitorsScreen> createState() => _VisitorsScreenState();
}

class _VisitorsScreenState extends ConsumerState<VisitorsScreen> {
  List<VisitorEntry> _visitors = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    try {
      final visitors = await ref.read(visitorsServiceProvider).getMyVisitors();
      if (mounted) setState(() => _visitors = visitors);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).visitors;
    final lockedCount = _visitors.where((v) => v.locked).length;

    // Build rows of 2 visitor cards each, matching the old app's grid.
    final rows = <List<VisitorEntry>>[];
    for (var i = 0; i < _visitors.length; i += 2) {
      rows.add(_visitors.sublist(
          i, i + 2 > _visitors.length ? _visitors.length : i + 2));
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const NavBar(),
            const SizedBox(height: 14),
            Text(dict.title,
                style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.emerald700)),
            const SizedBox(height: 2),
            Text(dict.subtitle,
                style: const TextStyle(fontSize: 13, color: AppColors.ink500)),
            const SizedBox(height: 12),
            const BannerAdSlot(placement: BannerPlacement.bannerVisitors),
            if (lockedCount > 0) ...[
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                    color: AppColors.gold100,
                    borderRadius: BorderRadius.circular(16)),
                child: Row(
                  children: [
                    const IconBadge(
                      background: AppColors.gold500,
                      size: 32,
                      borderWidth: 0,
                      icon: Icon(Icons.lock_rounded,
                          color: AppColors.white, size: 16),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        dict.lockedBanner(lockedCount),
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.emerald900),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (!_loading && _visitors.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Text(dict.empty,
                    textAlign: TextAlign.center,
                    style:
                        const TextStyle(fontSize: 13, color: AppColors.ink500)),
              ),
            const SizedBox(height: 12),
            for (final row in rows)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final entry in row) ...[
                      Expanded(
                          child: _VisitorCard(
                              entry: entry,
                              lockLabel: dict.lockLabel,
                              lockedName: dict.lockedName)),
                      if (entry != row.last) const SizedBox(width: 12),
                    ],
                    if (row.length == 1)
                      const Expanded(child: SizedBox.shrink()),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _VisitorCard extends StatelessWidget {
  const _VisitorCard(
      {required this.entry, required this.lockLabel, required this.lockedName});

  final VisitorEntry entry;
  final String lockLabel;
  final String lockedName;

  @override
  Widget build(BuildContext context) {
    final photos = entry.visitor?.profile.photos ?? const [];
    final photoUri = photos.isNotEmpty ? photos.first : _placeholderPhoto;
    final name =
        entry.locked ? lockedName : (entry.visitor?.profile.firstName ?? '');

    return Column(
      children: [
        AspectRatio(
          aspectRatio: 1,
          child: BlurredImage(
              imageUrl: photoUri,
              isBlurred: entry.locked,
              lockLabel: lockLabel),
        ),
        const SizedBox(height: 6),
        Text(name,
            style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.ink700)),
      ],
    );
  }
}
