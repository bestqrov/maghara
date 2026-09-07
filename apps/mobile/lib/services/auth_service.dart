import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/auth_user.dart';

/// Mirrors `RegisterPayload` from the old
/// `apps/mobile/src/services/auth.service.ts`.
class RegisterPayload {
  const RegisterPayload({
    required this.phoneNumber,
    this.email,
    required this.password,
    required this.firstName,
    required this.gender,
    required this.birthDate,
    required this.residenceCountry,
    required this.currentCity,
    required this.originCountry,
  });

  final String phoneNumber;
  final String? email;
  final String password;
  final String firstName;

  /// `'MALE' | 'FEMALE'` in the TS source.
  final String gender;
  final String birthDate;
  final String residenceCountry;
  final String currentCity;
  final String originCountry;

  Map<String, dynamic> toJson() => {
        'phoneNumber': phoneNumber,
        if (email != null) 'email': email,
        'password': password,
        'firstName': firstName,
        'gender': gender,
        'birthDate': birthDate,
        'residenceCountry': residenceCountry,
        'currentCity': currentCity,
        'originCountry': originCountry,
      };
}

/// Mirrors `LoginPayload` from the old
/// `apps/mobile/src/services/auth.service.ts`.
class LoginPayload {
  const LoginPayload({required this.phoneNumber, required this.password});

  final String phoneNumber;
  final String password;

  Map<String, dynamic> toJson() => {'phoneNumber': phoneNumber, 'password': password};
}

/// Mirrors the private `AuthResponse` interface from the old
/// `apps/mobile/src/services/auth.service.ts`.
class AuthResponse {
  const AuthResponse({required this.accessToken, required this.user});

  final String accessToken;
  final AuthUser user;

  factory AuthResponse.fromJson(Map<String, dynamic> json) => AuthResponse(
        accessToken: json['accessToken'] as String,
        user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
      );
}

/// Port of `apps/mobile/src/services/auth.service.ts`.
class AuthService {
  AuthService(this._dio);

  final Dio _dio;

  Future<AuthResponse> register(RegisterPayload payload) async {
    final res = await _dio.post<Map<String, dynamic>>('/auth/register', data: payload.toJson());
    return AuthResponse.fromJson(res.data!);
  }

  Future<AuthResponse> login(LoginPayload payload) async {
    final res = await _dio.post<Map<String, dynamic>>('/auth/login', data: payload.toJson());
    return AuthResponse.fromJson(res.data!);
  }

  Future<bool> checkPhoneAvailability(String phoneNumber) async {
    final res = await _dio.get<Map<String, dynamic>>(
      '/auth/phone-availability',
      queryParameters: {'phoneNumber': phoneNumber},
    );
    return res.data!['available'] as bool;
  }
}

final authServiceProvider = Provider<AuthService>((ref) => AuthService(ref.watch(dioProvider)));
