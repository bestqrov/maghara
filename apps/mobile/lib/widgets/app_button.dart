import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

enum AppButtonVariant { primary, gold, ghost, danger }

/// Ported from the previous Expo app's `src/components/Button.tsx`.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.loading = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final bool loading;

  Color get _backgroundColor {
    switch (variant) {
      case AppButtonVariant.primary:
        return AppColors.emerald600;
      case AppButtonVariant.gold:
        return AppColors.gold500;
      case AppButtonVariant.ghost:
        return Colors.transparent;
      case AppButtonVariant.danger:
        return AppColors.red500;
    }
  }

  Color get _textColor {
    switch (variant) {
      case AppButtonVariant.gold:
        return AppColors.emerald900;
      case AppButtonVariant.ghost:
        return AppColors.emerald700;
      case AppButtonVariant.primary:
      case AppButtonVariant.danger:
        return AppColors.white;
    }
  }

  bool get _disabled => onPressed == null || loading;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: _disabled ? 0.5 : 1,
      child: Material(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: _disabled ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (loading) ...[
                  SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: variant == AppButtonVariant.gold ? AppColors.emerald900 : AppColors.white,
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                Text(
                  label,
                  style: TextStyle(color: _textColor, fontWeight: FontWeight.w600, fontSize: 15),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
