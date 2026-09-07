import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/app_gate.dart';
import 'core/i18n/locale_provider.dart';
import 'core/router/app_router.dart';
import 'core/storage/auth_store.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/colors.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

/// Root widget.
///
/// First paint is gated on both the locale store and the auth store having
/// finished hydrating from `shared_preferences` (a splash screen is shown
/// until then) — this matters for the router in particular, since its
/// `redirect` callback (see `core/router/app_router.dart`) reads the auth
/// state synchronously and needs it to already reflect persisted storage,
/// not the just-constructed default (signed-out) state.
///
/// Once hydrated, [AppGate] takes over: it performs the one-time
/// maintenance/forced-update check before finally rendering the real
/// `MaterialApp.router`.
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeControllerProvider);
    final localeHydrated = ref.watch(localeHasHydratedProvider);
    final authHydrated = ref.watch(authStoreProvider.select((s) => s.hasHydrated));

    if (!localeHydrated || !authHydrated) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        locale: locale,
        supportedLocales: const [ui.Locale('ar'), ui.Locale('fr'), ui.Locale('en'), ui.Locale('es')],
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: const _SplashScreen(),
      );
    }

    return AppGate(
      child: _RouterApp(locale: locale),
    );
  }
}

class _RouterApp extends ConsumerWidget {
  const _RouterApp({required this.locale});

  final ui.Locale locale;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'قسمة و نصيب',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      locale: locale,
      supportedLocales: const [ui.Locale('ar'), ui.Locale('fr'), ui.Locale('en'), ui.Locale('es')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      routerConfig: router,
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
