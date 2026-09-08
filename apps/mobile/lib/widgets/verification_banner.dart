import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/i18n/locale_provider.dart';
import '../core/theme/colors.dart';
import '../models/enums.dart';
import 'icon_badge.dart';

/// Port of the previous Expo app's `src/components/VerificationBanner.tsx`.
///
/// Renders nothing for [VerificationStatusValue.verified] (or `.unknown`,
/// which shouldn't normally reach this widget but is treated the same way
/// defensively).
class VerificationBanner extends ConsumerWidget {
  const VerificationBanner({super.key, required this.status});

  final VerificationStatusValue status;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (status == VerificationStatusValue.verified ||
        status == VerificationStatusValue.unknown) {
      return const SizedBox.shrink();
    }

    final dict = ref.watch(appDictProvider).verificationBanner;

    late final String title;
    late final String subtitle;
    late final Color bg;
    late final Color fg;
    late final IconData icon;
    late final Color iconBg;

    switch (status) {
      case VerificationStatusValue.unverified:
        title = dict.unverifiedTitle;
        subtitle = dict.unverifiedSubtitle;
        bg = AppColors.gold100;
        fg = AppColors.emerald900;
        icon = Icons.shield_outlined;
        iconBg = AppColors.gold500;
        break;
      case VerificationStatusValue.pending:
        title = dict.pendingTitle;
        subtitle = dict.pendingSubtitle;
        bg = AppColors.emerald50;
        fg = AppColors.emerald700;
        icon = Icons.hourglass_top_rounded;
        iconBg = AppColors.emerald600;
        break;
      case VerificationStatusValue.rejected:
        title = dict.rejectedTitle;
        subtitle = dict.rejectedSubtitle;
        bg = AppColors.rose100;
        fg = AppColors.red500;
        icon = Icons.error_outline_rounded;
        iconBg = AppColors.red500;
        break;
      case VerificationStatusValue.verified:
      case VerificationStatusValue.unknown:
        // Unreachable, handled above.
        title = '';
        subtitle = '';
        bg = AppColors.white;
        fg = AppColors.ink700;
        icon = Icons.shield_outlined;
        iconBg = AppColors.ink500;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(18)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          IconBadge(
            background: iconBg,
            size: 36,
            borderWidth: 0,
            icon: Icon(icon, color: AppColors.white, size: 18),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        color: fg, fontSize: 14, fontWeight: FontWeight.w700)),
                const SizedBox(height: 2),
                Text(subtitle, style: TextStyle(color: fg, fontSize: 12)),
              ],
            ),
          ),
          if (status != VerificationStatusValue.pending) ...[
            const SizedBox(width: 12),
            InkWell(
              onTap: () => context.push('/verification'),
              child: Text(
                dict.verifyNow,
                style: TextStyle(
                    color: fg,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    decoration: TextDecoration.underline),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
