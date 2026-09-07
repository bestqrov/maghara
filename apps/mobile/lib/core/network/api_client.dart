import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config.dart';
import '../storage/auth_store.dart';

/// Thin wrapper around [Dio] configured for the app's REST API.
///
/// [getToken] and [onUnauthorized] are injectable hooks so this class has no
/// hard dependency on Riverpod or the auth store; [apiClientProvider] below
/// wires them up to [authStoreProvider] for real app use.
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

/// Shared [ApiClient] instance, wired to [authStoreProvider] so requests
/// carry the current session token and a 401 response logs the user out.
///
/// Services should depend on this provider (or [dioProvider]) rather than
/// constructing their own [Dio]/[ApiClient].
final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient();
  client.getToken = () => ref.read(authStoreProvider).token;
  client.onUnauthorized = () => ref.read(authStoreProvider.notifier).logout();
  return client;
});

/// The shared [Dio] instance backing [apiClientProvider], for services that
/// only need to make requests (most of them).
final dioProvider = Provider<Dio>((ref) => ref.watch(apiClientProvider).dio);
