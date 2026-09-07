import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/i18n/locale_provider.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/colors.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

/// Minimal root widget for the scaffold task: just a themed placeholder
/// screen with locale/RTL plumbing wired up end-to-end.
///
/// A later task replaces `home` with `MaterialApp.router` once the real
/// app shell and router exist.
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeControllerProvider);
    final hasHydrated = ref.watch(localeHasHydratedProvider);

    return MaterialApp(
      title: 'قسمة و نصيب',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      locale: locale,
      supportedLocales: const [
        ui.Locale('ar'),
        ui.Locale('fr'),
        ui.Locale('en'),
        ui.Locale('es'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: hasHydrated ? const _PlaceholderScreen() : const _SplashScreen(),
    );
  }
}

class _SplashScreen extends StatelessWidget {
  const _SplashScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(child: CircularProgressIndicator(color: AppColors.emerald600)),
    );
  }
}

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'قسمة و نصيب — Flutter scaffold OK',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.emerald700),
          ),
        ),
      ),
    );
  }
}
