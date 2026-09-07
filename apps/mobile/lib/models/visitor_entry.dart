/// Mirrors `VisitorEntry['visitor']` from the old
/// `apps/mobile/src/services/visitors.service.ts`.
class VisitorProfileSummary {
  const VisitorProfileSummary({required this.firstName, required this.photos});

  final String firstName;
  final List<String> photos;

  factory VisitorProfileSummary.fromJson(Map<String, dynamic> json) => VisitorProfileSummary(
        firstName: json['firstName'] as String,
        photos: (json['photos'] as List<dynamic>? ?? const []).cast<String>(),
      );

  Map<String, dynamic> toJson() => {'firstName': firstName, 'photos': photos};
}

class VisitorSummary {
  const VisitorSummary({required this.id, required this.profile, required this.subscriptionTier});

  final String id;
  final VisitorProfileSummary profile;
  final String subscriptionTier;

  factory VisitorSummary.fromJson(Map<String, dynamic> json) => VisitorSummary(
        id: json['_id'] as String,
        profile: VisitorProfileSummary.fromJson(json['profile'] as Map<String, dynamic>),
        subscriptionTier: json['subscriptionTier'] as String? ?? 'FREE',
      );

  Map<String, dynamic> toJson() => {'_id': id, 'profile': profile.toJson(), 'subscriptionTier': subscriptionTier};
}

/// Mirrors `VisitorEntry` from the old
/// `apps/mobile/src/services/visitors.service.ts`, returned by
/// `GET /visitors/me`. `visitor` is nullable in the TS source (the visiting
/// user may have been deleted since).
class VisitorEntry {
  const VisitorEntry({required this.visitor, required this.visitedAt, required this.locked});

  final VisitorSummary? visitor;
  final String visitedAt;
  final bool locked;

  factory VisitorEntry.fromJson(Map<String, dynamic> json) => VisitorEntry(
        visitor: json['visitor'] == null ? null : VisitorSummary.fromJson(json['visitor'] as Map<String, dynamic>),
        visitedAt: json['visitedAt'] as String,
        locked: json['locked'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'visitor': visitor?.toJson(),
        'visitedAt': visitedAt,
        'locked': locked,
      };
}
