import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../models/search_result_profile.dart';
import '../../../widgets/blurred_image.dart';

/// Port of the previous Expo app's `src/components/ProfileCard.tsx`.
class ProfileCard extends ConsumerWidget {
  const ProfileCard({
    super.key,
    required this.result,
    required this.onSendInterest,
    required this.sent,
    this.onView,
  });

  final SearchResultProfile result;
  final ValueChanged<String> onSendInterest;
  final ValueChanged<String>? onView;
  final bool sent;

  static int _calculateAge(String birthDate) {
    final birth = DateTime.tryParse(birthDate);
    if (birth == null) return 0;
    final diff = DateTime.now().difference(birth);
    return (diff.inDays / 365.25).floor();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider).profileCard;
    final profile = result.profile;
    final photoUri = profile.photos.isNotEmpty
        ? profile.photos.first
        : 'https://placehold.co/400x500/eef6f0/2f7a52?text=Zawaj';
    final disabled = result.blurred || sent;

    return Material(
      color: AppColors.white,
      borderRadius: BorderRadius.circular(22),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: result.blurred ? null : () => onView?.call(result.id),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AspectRatio(
              aspectRatio: 4 / 5,
              child: BlurredImage(
                imageUrl: photoUri,
                isBlurred: result.blurred,
                lockLabel: dict.lockLabel,
                borderRadius: 0,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          result.blurred
                              ? '••••••, ${_calculateAge(profile.birthDate)}'
                              : '${profile.firstName}, ${_calculateAge(profile.birthDate)}',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.emerald900),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (result.isVerified) ...[
                        const SizedBox(width: 6),
                        const Text('🛡️', style: TextStyle(fontSize: 12)),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${profile.currentCity} · ${profile.residenceCountry}',
                    style: const TextStyle(fontSize: 12, color: AppColors.ink500),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Material(
                    color: disabled ? AppColors.emerald100 : AppColors.emerald600,
                    borderRadius: BorderRadius.circular(12),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: disabled ? null : () => onSendInterest(result.id),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: Text(
                          sent ? dict.sent : dict.sendInterest,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: disabled ? AppColors.emerald500 : AppColors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
