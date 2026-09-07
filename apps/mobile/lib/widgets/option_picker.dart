import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

class AppOption {
  const AppOption({required this.value, required this.label});

  final String value;
  final String label;
}

/// Ported from the previous Expo app's `src/components/OptionPicker.tsx`.
/// A chip-style single-select control.
class OptionPicker extends StatelessWidget {
  const OptionPicker({
    super.key,
    this.label,
    required this.value,
    required this.onChanged,
    required this.options,
  });

  final String? label;
  final String value;
  final ValueChanged<String> onChanged;
  final List<AppOption> options;

  @override
  Widget build(BuildContext context) {
    final textAlign = Directionality.of(context) == TextDirection.rtl ? TextAlign.right : TextAlign.left;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (label != null) ...[
          Text(
            label!,
            textAlign: textAlign,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700),
          ),
          const SizedBox(height: 6),
        ],
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: options.map((option) {
            final selected = option.value == value;
            return InkWell(
              borderRadius: BorderRadius.circular(999),
              onTap: () => onChanged(option.value),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
                decoration: BoxDecoration(
                  color: selected ? AppColors.emerald600 : AppColors.white,
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(color: selected ? AppColors.emerald600 : AppColors.emerald100),
                ),
                child: Text(
                  option.label,
                  style: TextStyle(
                    fontSize: 13,
                    color: selected ? AppColors.white : AppColors.ink700,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
