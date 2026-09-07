import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/app_config.dart';

/// Port of `apps/mobile/src/services/appConfig.service.ts`.
///
/// `GET /app-config` is a public endpoint (no auth required). It's still
/// called through the shared [dioProvider]/[apiClientProvider] Dio instance
/// — the auth interceptor simply won't attach a token while signed out,
/// which is fine since the endpoint doesn't need one.
class AppConfigService {
  AppConfigService(this._dio);

  final Dio _dio;

  Future<AppConfigData> getAppConfig() async {
    final res = await _dio.get<Map<String, dynamic>>('/app-config');
    return AppConfigData.fromJson(res.data!);
  }
}

final appConfigServiceProvider = Provider<AppConfigService>((ref) => AppConfigService(ref.watch(dioProvider)));
