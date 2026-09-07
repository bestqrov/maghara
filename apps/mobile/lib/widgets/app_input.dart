import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// Ported from the previous Expo app's `src/components/Input.tsx`.
///
/// Unlike the Expo version (which needed an explicit `textAlign` derived
/// from the current locale), Flutter propagates text direction through
/// `Directionality` automatically, so this widget just reads it from the
/// ambient context.
class AppInput extends StatelessWidget {
  const AppInput({
    super.key,
    this.label,
    this.error,
    this.controller,
    this.onChanged,
    this.obscureText = false,
    this.keyboardType,
    this.placeholder,
    this.maxLines = 1,
  });

  final String? label;
  final String? error;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? placeholder;
  final int maxLines;

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
        TextField(
          controller: controller,
          onChanged: onChanged,
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLines: maxLines,
          textAlign: textAlign,
          style: const TextStyle(fontSize: 14, color: AppColors.ink700),
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: const TextStyle(color: AppColors.ink500),
            filled: true,
            fillColor: AppColors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: error != null ? AppColors.red400 : AppColors.emerald100),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: error != null ? AppColors.red400 : AppColors.emerald100),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: error != null ? AppColors.red400 : AppColors.emerald500, width: 1.5),
            ),
          ),
        ),
        if (error != null) ...[
          const SizedBox(height: 6),
          Text(
            error!,
            textAlign: textAlign,
            style: const TextStyle(fontSize: 12, color: AppColors.red500),
          ),
        ],
      ],
    );
  }
}
