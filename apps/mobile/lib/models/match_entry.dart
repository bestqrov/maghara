import 'enums.dart';

/// Mirrors `MatchEntry['otherUser']['profile']` from the old
/// `apps/mobile/src/services/matching.service.ts`.
class MatchOtherUserProfile {
  const MatchOtherUserProfile({required this.firstName, required this.photos});

  final String firstName;
  final List<String> photos;

  factory MatchOtherUserProfile.fromJson(Map<String, dynamic> json) => MatchOtherUserProfile(
        firstName: json['firstName'] as String,
        photos: (json['photos'] as List<dynamic>? ?? const []).cast<String>(),
      );

  Map<String, dynamic> toJson() => {'firstName': firstName, 'photos': photos};
}

/// Mirrors `MatchEntry['otherUser']` from the old
/// `apps/mobile/src/services/matching.service.ts`.
class MatchOtherUser {
  const MatchOtherUser({required this.id, required this.isVerified, required this.profile});

  final String id;
  final bool isVerified;
  final MatchOtherUserProfile profile;

  factory MatchOtherUser.fromJson(Map<String, dynamic> json) => MatchOtherUser(
        id: json['_id'] as String,
        isVerified: json['isVerified'] as bool? ?? false,
        profile: MatchOtherUserProfile.fromJson(json['profile'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {'_id': id, 'isVerified': isVerified, 'profile': profile.toJson()};
}

/// Mirrors `MatchEntry` from the old
/// `apps/mobile/src/services/matching.service.ts`, returned by
/// `GET /matching/my-matches`.
class MatchEntry {
  const MatchEntry({
    required this.id,
    required this.status,
    required this.isSuperLike,
    required this.direction,
    required this.createdAt,
    required this.otherUser,
  });

  final String id;
  final MatchStatus status;
  final bool isSuperLike;
  final MatchDirection direction;
  final String createdAt;
  final MatchOtherUser otherUser;

  factory MatchEntry.fromJson(Map<String, dynamic> json) => MatchEntry(
        id: json['_id'] as String,
        status: MatchStatus.fromJson(json['status'] as String?),
        isSuperLike: json['isSuperLike'] as bool? ?? false,
        direction: MatchDirection.fromJson(json['direction'] as String?),
        createdAt: json['createdAt'] as String,
        otherUser: MatchOtherUser.fromJson(json['otherUser'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'status': status.toJson(),
        'isSuperLike': isSuperLike,
        'direction': direction.toJson(),
        'createdAt': createdAt,
        'otherUser': otherUser.toJson(),
      };
}
