import 'package:flutter/material.dart';

import 'colors.dart';

/// Spacing scale used consistently across the app instead of hard-coded
/// paddings/margins.
class Spacing {
  Spacing._();

  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
}

/// Central `ThemeData` builder for the app, seeded from the emerald/gold
/// palette ported from the previous Expo app.
class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.emerald600,
      brightness: Brightness.light,
      primary: AppColors.emerald600,
      onPrimary: AppColors.white,
      secondary: AppColors.gold500,
      onSecondary: AppColors.emerald900,
      tertiary: AppColors.gold600,
      error: AppColors.red500,
      surface: AppColors.white,
      onSurface: AppColors.ink700,
    );

    const textTheme = _textTheme;

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.background,
      textTheme: textTheme,
      fontFamily: null,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.ink700,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.emerald600,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.emerald100),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.emerald100),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.emerald500, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.red400),
        ),
      ),
      dividerColor: AppColors.emerald100,
    );
  }

  static const TextTheme _textTheme = TextTheme(
    // Screen titles.
    titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.ink700),
    titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink700),
    // Body copy.
    bodyLarge: TextStyle(fontSize: 15, fontWeight: FontWeight.w400, color: AppColors.ink700),
    bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.ink700),
    // Small / caption text.
    bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.ink500),
    labelLarge: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.white),
    labelMedium: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700),
    labelSmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.ink500),
  );
}
