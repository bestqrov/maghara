// Widget test for LoginScreen: renders with its phone/password fields and
// submit button, and shows the dictionary's "invalid credentials" message
// when the (mocked) login call comes back 401 — never hitting the real
// network.

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/core/i18n/dictionary.dart';
import 'package:app/features/auth/login_screen.dart';
import 'package:app/services/auth_service.dart';

/// Always rejects with a 401, so the screen's "invalid credentials" branch
/// can be exercised deterministically.
class _Rejecting401AuthService extends AuthService {
  _Rejecting401AuthService() : super(Dio());

  @override
  Future<AuthResponse> login(LoginPayload payload) {
    final requestOptions = RequestOptions(path: '/auth/login');
    return Future.error(
      DioException(
        requestOptions: requestOptions,
        response: Response(requestOptions: requestOptions, statusCode: 401),
        type: DioExceptionType.badResponse,
      ),
    );
  }
}

/// Always rejects with a network-style error (no response), so the screen's
/// generic-error branch can be exercised.
class _NetworkFailureAuthService extends AuthService {
  _NetworkFailureAuthService() : super(Dio());

  @override
  Future<AuthResponse> login(LoginPayload payload) {
    return Future.error(
      DioException(requestOptions: RequestOptions(path: '/auth/login'), type: DioExceptionType.connectionError),
    );
  }
}

Widget _wrap(Widget child, {required AuthService authService}) {
  return ProviderScope(
    overrides: [authServiceProvider.overrideWithValue(authService)],
    child: const MaterialApp(home: LoginScreen()),
  );
}

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('renders phone/password fields and submit button', (tester) async {
    await tester.pumpWidget(_wrap(const LoginScreen(), authService: _NetworkFailureAuthService()));
    await tester.pump();

    expect(find.byType(TextField), findsNWidgets(2));
    expect(find.text(arDictionary.login.submit), findsOneWidget);
  });

  testWidgets('shows the invalid-credentials error on a 401 login response', (tester) async {
    await tester.pumpWidget(_wrap(const LoginScreen(), authService: _Rejecting401AuthService()));

    await tester.enterText(find.byType(TextField).first, '+212600000000');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.tap(find.text(arDictionary.login.submit));
    await tester.pump(); // start the async submit
    await tester.pump(const Duration(milliseconds: 50)); // let it resolve

    expect(find.text(arDictionary.login.errorInvalid), findsOneWidget);
  });

  testWidgets('shows a generic error on a non-401 login failure', (tester) async {
    await tester.pumpWidget(_wrap(const LoginScreen(), authService: _NetworkFailureAuthService()));

    await tester.enterText(find.byType(TextField).first, '+212600000000');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.tap(find.text(arDictionary.login.submit));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    expect(find.text(arDictionary.common.errorGeneric), findsOneWidget);
  });
}
