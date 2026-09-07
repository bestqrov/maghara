import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/visitor_entry.dart';

/// Port of `apps/mobile/src/services/visitors.service.ts`.
class VisitorsService {
  VisitorsService(this._dio);

  final Dio _dio;

  /// Fire-and-forget, matching the TS source (`recordVisit` doesn't return
  /// or await anything meaningful from the caller's perspective).
  Future<void> recordVisit(String profileId) async {
    await _dio.post('/visitors/visit/$profileId');
  }

  Future<List<VisitorEntry>> getMyVisitors() async {
    final res = await _dio.get<List<dynamic>>('/visitors/me');
    return res.data!.map((e) => VisitorEntry.fromJson(e as Map<String, dynamic>)).toList();
  }
}

final visitorsServiceProvider = Provider<VisitorsService>((ref) => VisitorsService(ref.watch(dioProvider)));
