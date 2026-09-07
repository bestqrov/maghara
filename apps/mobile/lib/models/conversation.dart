/// Mirrors `Conversation` from the old
/// `apps/mobile/src/services/chat.service.ts`.
class Conversation {
  const Conversation({
    required this.id,
    required this.matchId,
    required this.participants,
    required this.totalMessagesCount,
    required this.isLockedForFree,
    required this.unlockedBy,
    required this.lastMessageAt,
  });

  final String id;
  final String matchId;
  final List<String> participants;
  final int totalMessagesCount;
  final bool isLockedForFree;
  final List<String> unlockedBy;
  final String lastMessageAt;

  factory Conversation.fromJson(Map<String, dynamic> json) => Conversation(
        id: json['_id'] as String,
        matchId: json['matchId'] as String,
        participants: (json['participants'] as List<dynamic>? ?? const []).cast<String>(),
        totalMessagesCount: (json['totalMessagesCount'] as num?)?.toInt() ?? 0,
        isLockedForFree: json['isLockedForFree'] as bool? ?? false,
        unlockedBy: (json['unlockedBy'] as List<dynamic>? ?? const []).cast<String>(),
        lastMessageAt: json['lastMessageAt'] as String,
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'matchId': matchId,
        'participants': participants,
        'totalMessagesCount': totalMessagesCount,
        'isLockedForFree': isLockedForFree,
        'unlockedBy': unlockedBy,
        'lastMessageAt': lastMessageAt,
      };
}
