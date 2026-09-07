import 'package:dio/dio.dart';

import '../config.dart';

/// Thin wrapper around [Dio] configured for the app's REST API.
///
/// The real auth store doesn't exist yet at this layer (it's added in a
/// later task), so the token lookup and unauthorized-session callback are
/// injectable hooks that the auth store will wire up once it exists:
///
/// ```dart
/// apiClient.getToken = () => ref.read(authStoreProvider).token;
/// apiClient.onUnauthorized = () => ref.read(authStoreProvider.notifier).clear();
/// ```
class ApiClient {
  ApiClient({Dio? dio}) : dio = dio ?? Dio(BaseOptions(baseUrl: AppConfig.apiUrl)) {
    this.dio.interceptors.add(
          InterceptorsWrapper(
            onRequest: (options, handler) {
              final token = getToken?.call();
              if (token != null && token.isNotEmpty) {
                options.headers['Authorization'] = 'Bearer $token';
              }
              handler.next(options);
            },
            onError: (error, handler) {
              if (error.response?.statusCode == 401) {
                onUnauthorized?.call();
              }
              handler.next(error);
            },
          ),
        );
  }

  final Dio dio;

  /// Returns the current auth token, or null if signed out. Set by the auth
  /// store once it exists.
  String? Function()? getToken;

  /// Called when a request comes back 401, so the auth store can clear the
  /// session. Set by the auth store once it exists.
  void Function()? onUnauthorized;
}

/// Shared singleton instance used across the app.
final apiClient = ApiClient();
