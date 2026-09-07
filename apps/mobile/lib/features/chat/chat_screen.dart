import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/i18n/dictionary.dart';
import '../../core/i18n/locale_provider.dart';
import '../../core/network/socket_client.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';
import '../../models/conversation.dart';
import '../../models/enums.dart';
import '../../models/message.dart';
import '../../services/chat_service.dart';
import '../../services/website_links.dart';
import '../../widgets/app_button.dart';
import 'widgets/paywall_modal.dart';

/// Chat screen: port of the previous Expo app's `app/chat/[conversationId].tsx`.
///
/// RTL handling: "mine" message bubbles align to the trailing edge of the
/// *current text direction* rather than a hardcoded left/right, exactly like
/// the old app's `isRTL ? 'flex-start' : 'flex-end'` logic. In Flutter this
/// falls out of using `Alignment.centerEnd`/`CrossAxisAlignment.end`, which
/// already resolve against `Directionality.of(context)` (RTL for Arabic,
/// LTR otherwise) — no manual left/right branching needed.
class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key, required this.conversationId, this.matchId});

  final String conversationId;
  final String? matchId;

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();

  List<Message> _messages = const [];
  Conversation? _conversation;
  String? _error;
  bool _showPaywall = false;
  bool _unlocking = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  Future<void> _init() async {
    final token = ref.read(authStoreProvider).token;
    if (token == null) return;

    ref.read(chatServiceProvider).getMessages(widget.conversationId).then((messages) {
      if (mounted) setState(() => _messages = messages);
    });
    await _refreshConversation();

    socketClient.connect(token);
    socketClient.emit('joinConversation', {'conversationId': widget.conversationId});
    socketClient.on('newMessage', _onNewMessage);
    socketClient.on('exception', _onException);
  }

  Future<void> _refreshConversation() async {
    final matchId = widget.matchId;
    if (matchId == null) return;
    try {
      final conversation = await ref.read(chatServiceProvider).getOrCreateConversation(matchId);
      if (mounted) setState(() => _conversation = conversation);
    } catch (_) {
      // Best-effort refresh; keep whatever conversation state we already have.
    }
  }

  void _onNewMessage(dynamic data) {
    try {
      final message = Message.fromJson(Map<String, dynamic>.from(data as Map));
      if (mounted) setState(() => _messages = [..._messages, message]);
      _refreshConversation();
    } catch (_) {
      // Ignore malformed payloads.
    }
  }

  void _onException(dynamic data) {
    final dict = ref.read(appDictProvider).chat;
    String? message;
    try {
      final payload = Map<String, dynamic>.from(data as Map);
      final raw = payload['message'];
      message = raw is List ? raw.first as String? : raw as String?;
    } catch (_) {
      message = null;
    }
    if (!mounted) return;
    setState(() => _error = message ?? dict.errorSendFailed);
    if (message != null && (message.contains('limit') || message.contains('Upgrade'))) {
      setState(() => _showPaywall = true);
    }
  }

  @override
  void dispose() {
    socketClient.off('newMessage');
    socketClient.off('exception');
    socketClient.disconnect();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  bool get _isVip {
    final user = ref.read(authStoreProvider).user;
    return user?.subscriptionTier == SubscriptionTier.vip || user?.subscriptionTier == SubscriptionTier.crossBorderVip;
  }

  bool get _isUnlockedByMe {
    final user = ref.read(authStoreProvider).user;
    final conversation = _conversation;
    if (user == null || conversation == null) return false;
    return conversation.unlockedBy.contains(user.id);
  }

  bool get _isLocked {
    final conversation = _conversation;
    if (conversation == null) return false;
    return conversation.isLockedForFree && !_isVip && !_isUnlockedByMe;
  }

  void _handleSend() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;
    if (_isLocked) {
      setState(() => _showPaywall = true);
      return;
    }
    setState(() => _error = null);
    socketClient.emit('sendMessage', {'conversationId': widget.conversationId, 'text': text});
    _textController.clear();
  }

  Future<void> _handleUnlock() async {
    final dict = ref.read(appDictProvider).chat;
    setState(() => _unlocking = true);
    try {
      await ref.read(chatServiceProvider).unlockConversation(widget.conversationId);
      await _refreshConversation();
      if (mounted) setState(() => _showPaywall = false);
    } catch (_) {
      if (mounted) setState(() => _error = dict.errorUnlockFailed);
    } finally {
      if (mounted) setState(() => _unlocking = false);
    }
  }

  Future<void> _handleUpgradeVip() async {
    final locale = ref.read(localeControllerProvider).languageCode;
    final uri = Uri.parse(websiteUrl(locale, '/store'));
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).chat;
    final currentUserId = ref.watch(authStoreProvider).user?.id;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            _buildChatBody(dict, currentUserId),
            if (_showPaywall)
              Positioned.fill(
                child: Material(
                  color: AppColors.emerald900.withOpacity(0.5),
                  child: Center(
                    child: PaywallModal(
                      loading: _unlocking,
                      onUnlockWithCoins: _handleUnlock,
                      onUpgradeVip: _handleUpgradeVip,
                      onClose: () => setState(() => _showPaywall = false),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildChatBody(ChatDict dict, String? currentUserId) {
    return Column(
          children: [
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final message = _messages[index];
                  final mine = message.senderId == currentUserId;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      mainAxisAlignment: mine ? MainAxisAlignment.end : MainAxisAlignment.start,
                      children: [
                        ConstrainedBox(
                          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: mine ? AppColors.emerald600 : AppColors.emerald50,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              message.messageText,
                              style: TextStyle(fontSize: 14, color: mine ? AppColors.white : AppColors.emerald900),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            if (_conversation != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Text(
                  dict.freeMessages(_conversation!.totalMessagesCount, ChatService.freeMessageLimit),
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 11, color: AppColors.ink500),
                ),
              ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Text(_error!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: AppColors.red500)),
              ),
            if (_isLocked)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: AppColors.emerald100)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(dict.limitReached, style: const TextStyle(fontSize: 13, color: AppColors.ink500)),
                    ),
                    const SizedBox(width: 8),
                    AppButton(
                      label: dict.unlockChat,
                      variant: AppButtonVariant.gold,
                      onPressed: () => setState(() => _showPaywall = true),
                    ),
                  ],
                ),
              )
            else
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: AppColors.emerald100)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _textController,
                        decoration: InputDecoration(
                          hintText: dict.placeholder,
                          hintStyle: const TextStyle(color: AppColors.ink500),
                          filled: true,
                          fillColor: AppColors.white,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: AppColors.emerald100),
                          ),
                        ),
                        onSubmitted: (_) => _handleSend(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    AppButton(label: dict.send, onPressed: _handleSend),
                  ],
                ),
              ),
          ],
        );
  }
}
