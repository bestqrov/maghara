import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:screen_protector/screen_protector.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/app_config.dart';
import '../services/app_config_service.dart';
import '../widgets/icon_badge.dart';
import 'i18n/locale_provider.dart';
import 'theme/app_theme.dart';
import 'theme/colors.dart';

/// Result of the one-time app-config check performed by [AppGate].
class _GateCheck {
  const _GateCheck(this.config);

  /// Null when the request failed — [AppGate] fails open in that case
  /// (matches the old Expo `appConfig.store.ts`: `checked` is set to `true`
  /// in the `finally` block regardless of success/failure, and a null
  /// `config` simply skips the maintenance/update gates).
  final AppConfigData? config;
}

/// Port of the old Expo `AppGate.tsx` + `appConfig.store.ts`.
///
/// On first build, fetches `/app-config` once (a public endpoint). While
/// that request is in flight, nothing is rendered (matching the old
/// `if (!checked) return null;"). Once resolved (successfully or not — this
/// gate fails open on error so a network hiccup never blocks the app):
///   - maintenance mode -> full-screen maintenance message.
///   - forced update (native build number below the required one) ->
///     full-screen update message with an optional "update now" link.
///   - otherwise -> renders [child] (the real app).
///
/// Also toggles screenshot-capture blocking via `screen_protector` based on
/// `config.appSettings.screenshotBlock`, mirroring the old
/// `expo-screen-capture` wiring.
class AppGate extends ConsumerStatefulWidget {
  const AppGate({super.key, required this.child});

  final Widget child;

  @override
  ConsumerState<AppGate> createState() => _AppGateState();
}

class _AppGateState extends ConsumerState<AppGate> {
  _GateCheck? _check;
  int _nativeVersionCode = 0;

  @override
  void initState() {
    super.initState();
    _run();
  }

  Future<void> _run() async {
    AppConfigData? config;
    try {
      config = await ref.read(appConfigServiceProvider).getAppConfig();
    } catch (_) {
      // Fail open: never block the app on a network hiccup.
      config = null;
    }

    int versionCode = 0;
    try {
      // Defensively timed out: on some platforms/test environments a
      // missing or misbehaving platform-channel implementation can leave
      // this call pending forever, which would otherwise wedge the app on
      // the splash/loading state indefinitely.
      final info =
          await PackageInfo.fromPlatform().timeout(const Duration(seconds: 5));
      versionCode = int.tryParse(info.buildNumber) ?? 0;
    } catch (_) {
      versionCode = 0;
    }

    _applyScreenshotBlock(config?.appSettings.screenshotBlock ?? false);

    if (mounted) {
      setState(() {
        _check = _GateCheck(config);
        _nativeVersionCode = versionCode;
      });
    }
  }

  void _applyScreenshotBlock(bool blocked) {
    // TODO: `screen_protector`'s screenshot prevention relies on native
    // platform hooks (`FLAG_SECURE` on Android, a secure overlay on iOS)
    // that haven't been verified end-to-end on this Flutter/SDK setup yet.
    // Calls are best-effort and swallow errors so a missing/broken native
    // implementation never blocks the rest of the app.
    try {
      if (blocked) {
        ScreenProtector.preventScreenshotOn();
      } else {
        ScreenProtector.preventScreenshotOff();
      }
    } catch (_) {
      // Ignore — see TODO above.
    }
  }

  @override
  Widget build(BuildContext context) {
    final check = _check;
    if (check == null) {
      return const _GateScaffold(child: SizedBox.shrink());
    }

    final config = check.config;
    final dict = ref.watch(appDictProvider).appGate;

    if (config != null && config.appSettings.maintenanceMode) {
      return _GateScaffold(
        child: _GateMessage(
          icon: Icons.build_rounded,
          badgeBackground: AppColors.gold100,
          badgeIconColor: AppColors.gold600,
          title: dict.maintenanceTitle,
          message: config.appSettings.maintenanceMessage?.isNotEmpty == true
              ? config.appSettings.maintenanceMessage!
              : dict.maintenanceDefaultMessage,
        ),
      );
    }

    if (config != null &&
        config.appUpdate.enabled &&
        _nativeVersionCode < config.appUpdate.requiredVersionCode) {
      final appLink = config.appUpdate.appLink;
      return _GateScaffold(
        child: _GateMessage(
          icon: Icons.system_update_rounded,
          badgeBackground: AppColors.emerald100,
          badgeIconColor: AppColors.emerald600,
          title: dict.updateTitle,
          message: config.appUpdate.description?.isNotEmpty == true
              ? config.appUpdate.description!
              : dict.updateDefaultMessage,
          buttonLabel:
              appLink != null && appLink.isNotEmpty ? dict.updateButton : null,
          onButtonPressed: appLink != null && appLink.isNotEmpty
              ? () => launchUrl(Uri.parse(appLink),
                  mode: LaunchMode.externalApplication)
              : null,
        ),
      );
    }

    return widget.child;
  }
}

/// Standalone `MaterialApp` used only for the pre-check/maintenance/update
/// states, so they get the app's theme, locale and RTL direction even
/// though the real `MaterialApp.router` (passed in as [AppGate.child]) has
/// not been mounted yet.
class _GateScaffold extends ConsumerWidget {
  const _GateScaffold({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeControllerProvider);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      color: AppColors.background,
      theme: AppTheme.light,
      locale: locale,
      supportedLocales: const [
        ui.Locale('ar'),
        ui.Locale('fr'),
        ui.Locale('en'),
        ui.Locale('es')
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: Scaffold(
          backgroundColor: AppColors.background, body: SafeArea(child: child)),
    );
  }
}

class _GateMessage extends StatelessWidget {
  const _GateMessage({
    required this.icon,
    required this.badgeBackground,
    required this.badgeIconColor,
    required this.title,
    required this.message,
    this.buttonLabel,
    this.onButtonPressed,
  });

  final IconData icon;
  final Color badgeBackground;
  final Color badgeIconColor;
  final String title;
  final String message;
  final String? buttonLabel;
  final VoidCallback? onButtonPressed;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconBadge(
              background: badgeBackground,
              size: 72,
              icon: Icon(icon, color: badgeIconColor, size: 34),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.emerald700),
            ),
            const SizedBox(height: 10),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: AppColors.ink500),
            ),
            if (buttonLabel != null) ...[
              const SizedBox(height: 12),
              ElevatedButton(
                  onPressed: onButtonPressed, child: Text(buttonLabel!)),
            ],
          ],
        ),
      ),
    );
  }
}
