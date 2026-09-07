import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/verification_status.dart';

/// Port of `apps/mobile/src/services/verification.service.ts`.
class VerificationService {
  VerificationService(this._dio);

  final Dio _dio;

  Future<VerificationStatusResponse> getMyVerificationStatus() async {
    final res = await _dio.get<Map<String, dynamic>>('/verification/me');
    return VerificationStatusResponse.fromJson(res.data!);
  }

  Future<void> submitVerification({required String idDocumentUrl, String? residencyDocumentUrl}) async {
    await _dio.post(
      '/verification/submit',
      data: {
        'idDocumentUrl': idDocumentUrl,
        if (residencyDocumentUrl != null) 'residencyDocumentUrl': residencyDocumentUrl,
      },
    );
  }
}

final verificationServiceProvider =
    Provider<VerificationService>((ref) => VerificationService(ref.watch(dioProvider)));
