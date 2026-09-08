import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// Color scheme for a [StatPill], mapped onto the app's own emerald/gold/rose
/// tints — no new hues.
enum StatPillVariant { emerald, gold, rose }

/// A small rounded pill showing an icon + short text (e.g. "5/day left" or
/// "12 visitors"). Used for lightweight counters/badges next to headings.
class StatPill extends StatelessWidget {
  const StatPill({
    super.key,
    required this.icon,
    required this.label,
    this.variant = StatPillVariant.emerald,
  });

  final IconData icon;
  final String label;
  final StatPillVariant variant;

  Color get _background {
    switch (variant) {
      case StatPillVariant.emerald:
        return AppColors.emerald50;
      case StatPillVariant.gold:
        return AppColors.gold100;
      case StatPillVariant.rose:
        return AppColors.rose100;
    }
  }

  Color get _foreground {
    switch (variant) {
      case StatPillVariant.emerald:
        return AppColors.emerald700;
      case StatPillVariant.gold:
        return AppColors.gold600;
      case StatPillVariant.rose:
        return AppColors.red500;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: _background, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: _foreground),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: _foreground)),
        ],
      ),
    );
  }
}
