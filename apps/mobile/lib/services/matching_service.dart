import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/match_entry.dart';
import '../models/search_result_profile.dart';

/// Mirrors `SearchFilters` from the old
/// `apps/mobile/src/services/matching.service.ts`.
class SearchFilters {
  const SearchFilters({
    this.minAge,
    this.maxAge,
    this.targetCountry,
    this.targetCity,
    this.relocationPreference,
    this.scope,
    this.page,
    this.limit,
  });

  final int? minAge;
  final int? maxAge;
  final String? targetCountry;
  final String? targetCity;

  /// `'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY'` in the TS source.
  final String? relocationPreference;

  /// `'LOCAL' | 'DIASPORA'` in the TS source.
  final String? scope;
  final int? page;
  final int? limit;

  Map<String, dynamic> toQueryParameters() => {
        if (minAge != null) 'minAge': minAge,
        if (maxAge != null) 'maxAge': maxAge,
        if (targetCountry != null) 'targetCountry': targetCountry,
        if (targetCity != null) 'targetCity': targetCity,
        if (relocationPreference != null) 'relocationPreference': relocationPreference,
        if (scope != null) 'scope': scope,
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
      };
}

/// Port of `apps/mobile/src/services/matching.service.ts`.
class MatchingService {
  MatchingService(this._dio);

  final Dio _dio;

  /// Matches `DAILY_FREE_INTERESTS` from the TS source.
  static const int dailyFreeInterests = 5;

  Future<List<SearchResultProfile>> search(SearchFilters filters) async {
    final res = await _dio.get<List<dynamic>>(
      '/matching/search',
      queryParameters: filters.toQueryParameters(),
    );
    return res.data!.map((e) => SearchResultProfile.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> sendInterest(String receiverId, {bool isSuperLike = false}) async {
    await _dio.post('/matching/interest/$receiverId', data: {'isSuperLike': isSuperLike});
  }

  Future<List<MatchEntry>> getMyMatches() async {
    final res = await _dio.get<List<dynamic>>('/matching/my-matches');
    return res.data!.map((e) => MatchEntry.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> acceptMatch(String matchId) async {
    await _dio.post('/matching/$matchId/accept');
  }

  Future<void> rejectMatch(String matchId) async {
    await _dio.post('/matching/$matchId/reject');
  }

  Future<void> markEngaged(String matchId) async {
    await _dio.post('/matching/$matchId/engaged');
  }
}

final matchingServiceProvider = Provider<MatchingService>((ref) => MatchingService(ref.watch(dioProvider)));
