// Smoke test for the real app shell: verifies that once locale + auth
// storage have hydrated, the AppGate check has resolved (failing open on
// its fake network error), and the router has redirected an unauthenticated
// user to the login screen.

import 'package:dio/dio.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/main.dart';
import 'package:app/models/ad_settings.dart';
import 'package:app/models/app_config.dart';
import 'package:app/services/ad_settings_service.dart';
import 'package:app/services/app_config_service.dart';

/// Always fails instantly, so [AppGate]'s fail-open path resolves quickly
/// and deterministically instead of waiting on (or hanging on) a real
/// network call in the test environment.
class _FailingAppConfigService extends AppConfigService {
  _FailingAppConfigService() : super(Dio());

  @override
  Future<AppConfigData> getAppConfig() {
    return Future.error(DioException(requestOptions: RequestOptions(path: '/app-config')));
  }
}

/// Always fails instantly, so the app-open ad controller's cached
/// `adSettingsProvider` fetch resolves quickly and deterministically
/// (to "ads off") instead of attempting a real network call in the test
/// environment.
class _FailingAdSettingsService extends AdSettingsService {
  _FailingAdSettingsService() : super(Dio());

  @override
  Future<AdSettings> getAdSettings() {
    return Future.error(DioException(requestOptions: RequestOptions(path: '/ad-settings')));
  }
}

void main() {
  const packageInfoChannel = MethodChannel('dev.fluttercommunity.plus/package_info');

  setUp(() {
    SharedPreferences.setMockInitialValues({});

    // `package_info_plus` has no platform implementation in the widget-test
    // environment, and unlike most plugins its method channel call never
    // resolves on its own there (it just hangs) — mock it so AppGate's
    // native-version check can complete.
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      packageInfoChannel,
      (call) async => <String, dynamic>{
        'appName': 'app',
        'packageName': 'com.qismawanasib.app',
        'version': '1.0.0',
        'buildNumber': '1',
      },
    );
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      packageInfoChannel,
      null,
    );
  });

  testWidgets('redirects an unauthenticated user to the login screen', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          appConfigServiceProvider.overrideWithValue(_FailingAppConfigService()),
          adSettingsServiceProvider.overrideWithValue(_FailingAdSettingsService()),
        ],
        child: const MyApp(),
      ),
    );

    // Let locale/auth hydration, the AppGate check, and the router's
    // initial redirect all settle.
    for (var i = 0; i < 20; i++) {
      await tester.pump(const Duration(milliseconds: 100));
    }

    expect(find.text('دخول'), findsWidgets); // login submit button label (ar)
  });
}
