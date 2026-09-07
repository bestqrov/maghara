import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/conversation.dart';
import '../models/message.dart';

/// Port of `apps/mobile/src/services/chat.service.ts`.
class ChatService {
  ChatService(this._dio);

  final Dio _dio;

  /// Matches `FREE_MESSAGE_LIMIT` from the TS source.
  static const int freeMessageLimit = 10;

  /// Matches `UNLOCK_COIN_COST` from the TS source.
  static const int unlockCoinCost = 5;

  Future<Conversation> getOrCreateConversation(String matchId) async {
    final res = await _dio.post<Map<String, dynamic>>('/chat/conversations/$matchId');
    return Conversation.fromJson(res.data!);
  }

  Future<List<Message>> getMessages(String conversationId) async {
    final res = await _dio.get<List<dynamic>>('/chat/conversations/$conversationId/messages');
    return res.data!.map((e) => Message.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Conversation> unlockConversation(String conversationId) async {
    final res = await _dio.post<Map<String, dynamic>>('/chat/conversations/$conversationId/unlock');
    return Conversation.fromJson(res.data!);
  }
}

final chatServiceProvider = Provider<ChatService>((ref) => ChatService(ref.watch(dioProvider)));
