/// Mirrors `Message` from the old `apps/mobile/src/services/chat.service.ts`.
class Message {
  const Message({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.receiverId,
    required this.messageText,
    required this.isRead,
    required this.createdAt,
  });

  final String id;
  final String conversationId;
  final String senderId;
  final String receiverId;
  final String messageText;
  final bool isRead;
  final String createdAt;

  factory Message.fromJson(Map<String, dynamic> json) => Message(
        id: json['_id'] as String,
        conversationId: json['conversationId'] as String,
        senderId: json['senderId'] as String,
        receiverId: json['receiverId'] as String,
        messageText: json['messageText'] as String,
        isRead: json['isRead'] as bool? ?? false,
        createdAt: json['createdAt'] as String,
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'conversationId': conversationId,
        'senderId': senderId,
        'receiverId': receiverId,
        'messageText': messageText,
        'isRead': isRead,
        'createdAt': createdAt,
      };
}
