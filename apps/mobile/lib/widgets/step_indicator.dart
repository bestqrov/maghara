import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// Ported from the previous Expo app's `src/components/StepIndicator.tsx`.
/// A row of dots showing progress through a multi-step flow.
class StepIndicator extends StatelessWidget {
  const StepIndicator({super.key, required this.total, required this.current});

  final int total;
  final int current;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(total, (index) {
        final bool isActive = index == current;
        final bool isDone = index < current;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            height: 6,
            width: isActive ? 32 : 16,
            decoration: BoxDecoration(
              color: isActive
                  ? AppColors.emerald600
                  : isDone
                      ? AppColors.emerald300
                      : AppColors.emerald100,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
        );
      }),
    );
  }
}
