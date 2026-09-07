import 'dart:ui';

import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// Port of the previous Expo app's `src/components/BlurredImage.tsx`.
///
/// Displays a network image; when [isBlurred] is true, a blur + lock overlay
/// is shown on top instead of `expo-blur`'s `BlurView`.
class BlurredImage extends StatelessWidget {
  const BlurredImage({
    super.key,
    required this.imageUrl,
    required this.isBlurred,
    this.lockLabel,
    this.borderRadius = 20,
    this.onUnlockTap,
    this.fit = BoxFit.cover,
  });

  final String imageUrl;
  final bool isBlurred;
  final String? lockLabel;
  final double borderRadius;
  final VoidCallback? onUnlockTap;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Container(
        color: AppColors.emerald50,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              imageUrl,
              fit: fit,
              errorBuilder: (context, error, stackTrace) => Container(color: AppColors.emerald50),
            ),
            if (isBlurred)
              Positioned.fill(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                  child: Container(
                    color: AppColors.emerald900.withOpacity(0.35),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onUnlockTap,
                        child: Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: const BoxDecoration(color: AppColors.gold500, shape: BoxShape.circle),
                                alignment: Alignment.center,
                                child: const Text('🔒', style: TextStyle(fontSize: 18)),
                              ),
                              const SizedBox(height: 8),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                child: Text(
                                  lockLabel ?? '',
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    color: AppColors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
