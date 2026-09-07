// Widget tests for SettingsScreen's change-password flow: client-side
// validation (too-short / mismatched new password) and the wrong-current-
// password (401) server error path, all against a mocked UsersService so no
// real network is touched.

import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/features/settings/settings_screen.dart';
import 'package:app/models/app_config.dart';
import 'package:app/models/auth_user.dart';
import 'package:app/models/enums.dart';
import 'package:app/services/app_config_service.dart';
import 'package:app/services/users_service.dart';

const _me = AuthUser(
  id: 'me1',
  phoneNumber: '+212600000000',
  subscriptionTier: SubscriptionTier.free,
  profile: UserProfile(
    firstName: 'Sara',
    gender: Gender.female,
    birthDate: '1998-01-01',
    residenceCountry: 'Morocco',
    currentCity: 'Casablanca',
    originCountry: 'Morocco',
    relocationPreference: RelocationPreference.localOnly,
    photos: [],
    isPhotoBlurred: false,
  ),
);

/// Fails instantly, so the settings screen's optional-links section (which
/// depends on it) just stays hidden without a pending/hanging network call.
class _FailingAppConfigService extends AppConfigService {
  _FailingAppConfigService() : super(Dio());

  @override
  Future<AppConfigData> getAppConfig() {
    return Future.error(DioException(requestOptions: RequestOptions(path: '/app-config')));
  }
}

class _FakeUsersService extends UsersService {
  _FakeUsersService({this.onChangePassword}) : super(Dio());

  final Future<String> Function()? onChangePassword;

  @override
  Future<String> changePassword({required String currentPassword, required String newPassword}) {
    return onChangePassword?.call() ?? Future.value('ok');
  }
}

Widget _buildApp({required UsersService usersService}) {
  final router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => const SettingsScreen()),
      GoRoute(path: '/login', builder: (context, state) => const Text('login screen')),
    ],
  );

  return ProviderScope(
    overrides: [
      appConfigServiceProvider.overrideWithValue(_FailingAppConfigService()),
      usersServiceProvider.overrideWithValue(usersService),
    ],
    child: MaterialApp.router(routerConfig: router),
  );
}

Future<void> _settle(WidgetTester tester) async {
  for (var i = 0; i < 10; i++) {
    await tester.pump(const Duration(milliseconds: 50));
  }
}

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({
      'zawaj-auth': jsonEncode({'token': 'tok-123', 'user': _me.toJson()}),
    });
  });

  testWidgets('shows a validation error when the new password is too short', (tester) async {
    await tester.pumpWidget(_buildApp(usersService: _FakeUsersService()));
    await _settle(tester);

    final fields = find.byType(TextField);
    expect(fields, findsNWidgets(3));

    await tester.enterText(fields.at(0), 'currentpass');
    await tester.enterText(fields.at(1), 'short');
    await tester.enterText(fields.at(2), 'short');
    await tester.tap(find.text('حفظ'));
    await _settle(tester);

    expect(find.text('الپاسوورد الجديد خاصو يكون 8 حروف على الأقل'), findsOneWidget);
  });

  testWidgets('shows a validation error when new/confirm passwords do not match', (tester) async {
    await tester.pumpWidget(_buildApp(usersService: _FakeUsersService()));
    await _settle(tester);

    final fields = find.byType(TextField);
    await tester.enterText(fields.at(0), 'currentpass');
    await tester.enterText(fields.at(1), 'newpassword1');
    await tester.enterText(fields.at(2), 'newpassword2');
    await tester.tap(find.text('حفظ'));
    await _settle(tester);

    expect(find.text('الپاسوورد الجديد ماشي متطابق مع التأكيد'), findsOneWidget);
  });

  testWidgets('shows the wrong-current-password error on a 401 response', (tester) async {
    final service = _FakeUsersService(
      onChangePassword: () => Future.error(
        DioException(
          requestOptions: RequestOptions(path: '/users/me/password'),
          response: Response(requestOptions: RequestOptions(path: '/users/me/password'), statusCode: 401),
          type: DioExceptionType.badResponse,
        ),
      ),
    );

    await tester.pumpWidget(_buildApp(usersService: service));
    await _settle(tester);

    final fields = find.byType(TextField);
    await tester.enterText(fields.at(0), 'wrongcurrent');
    await tester.enterText(fields.at(1), 'newpassword1');
    await tester.enterText(fields.at(2), 'newpassword1');
    await tester.tap(find.text('حفظ'));
    await _settle(tester);

    expect(find.text('الپاسوورد الحالي غير صحيح'), findsOneWidget);
  });

  testWidgets('shows a success message when the password change succeeds', (tester) async {
    await tester.pumpWidget(_buildApp(usersService: _FakeUsersService()));
    await _settle(tester);

    final fields = find.byType(TextField);
    await tester.enterText(fields.at(0), 'currentpass');
    await tester.enterText(fields.at(1), 'newpassword1');
    await tester.enterText(fields.at(2), 'newpassword1');
    await tester.tap(find.text('حفظ'));
    await _settle(tester);

    expect(find.text('تبدل الپاسوورد بنجاح'), findsOneWidget);
  });
}
