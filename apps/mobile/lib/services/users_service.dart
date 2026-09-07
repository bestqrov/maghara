import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/auth_user.dart';

/// Mirrors `UpdateProfilePayload` from the old
/// `apps/mobile/src/services/users.service.ts`. All fields are optional
/// (partial update), matching the TS interface.
class UpdateProfilePayload {
  const UpdateProfilePayload({
    this.firstName,
    this.currentCity,
    this.residenceCountry,
    this.originCountry,
    this.relocationPreference,
    this.jobTitle,
    this.educationLevel,
    this.bio,
    this.photos,
    this.minAge,
    this.maxAge,
    this.targetCountries,
    this.targetCities,
  });

  final String? firstName;
  final String? currentCity;
  final String? residenceCountry;
  final String? originCountry;

  /// `'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY'` in the TS source.
  final String? relocationPreference;
  final String? jobTitle;
  final String? educationLevel;
  final String? bio;
  final List<String>? photos;
  final int? minAge;
  final int? maxAge;
  final List<String>? targetCountries;
  final List<String>? targetCities;

  Map<String, dynamic> toJson() => {
        if (firstName != null) 'firstName': firstName,
        if (currentCity != null) 'currentCity': currentCity,
        if (residenceCountry != null) 'residenceCountry': residenceCountry,
        if (originCountry != null) 'originCountry': originCountry,
        if (relocationPreference != null) 'relocationPreference': relocationPreference,
        if (jobTitle != null) 'jobTitle': jobTitle,
        if (educationLevel != null) 'educationLevel': educationLevel,
        if (bio != null) 'bio': bio,
        if (photos != null) 'photos': photos,
        if (minAge != null) 'minAge': minAge,
        if (maxAge != null) 'maxAge': maxAge,
        if (targetCountries != null) 'targetCountries': targetCountries,
        if (targetCities != null) 'targetCities': targetCities,
      };
}

/// Port of `apps/mobile/src/services/users.service.ts`.
///
/// Note: `FullUser` lives in `lib/models/auth_user.dart` alongside `AuthUser`
/// since it's a data model, not service logic.
class UsersService {
  UsersService(this._dio);

  final Dio _dio;

  Future<FullUser> getMe() async {
    final res = await _dio.get<Map<String, dynamic>>('/users/me');
    return FullUser.fromJson(res.data!);
  }

  Future<AuthUser> updateProfile(UpdateProfilePayload payload) async {
    final res = await _dio.patch<Map<String, dynamic>>('/users/me/profile', data: payload.toJson());
    return AuthUser.fromJson(res.data!);
  }

  Future<String> changePassword({required String currentPassword, required String newPassword}) async {
    final res = await _dio.patch<Map<String, dynamic>>(
      '/users/me/password',
      data: {'currentPassword': currentPassword, 'newPassword': newPassword},
    );
    return res.data!['message'] as String;
  }

  Future<String> deleteAccount({required String password}) async {
    final res = await _dio.delete<Map<String, dynamic>>('/users/me', data: {'password': password});
    return res.data!['message'] as String;
  }
}

final usersServiceProvider = Provider<UsersService>((ref) => UsersService(ref.watch(dioProvider)));
