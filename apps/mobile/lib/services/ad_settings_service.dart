import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/ad_settings.dart';

/// Port of `apps/mobile/src/services/adSettings.service.ts`.
class AdSettingsService {
  AdSettingsService(this._dio);

  final Dio _dio;

  Future<AdSettings> getAdSettings() async {
    final res = await _dio.get<Map<String, dynamic>>('/ad-settings');
    return AdSettings.fromJson(res.data!);
  }
}

final adSettingsServiceProvider = Provider<AdSettingsService>((ref) => AdSettingsService(ref.watch(dioProvider)));
