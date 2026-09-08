import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/i18n/dictionary.dart';
import '../../core/i18n/locale_provider.dart';
import '../../core/theme/colors.dart';
import '../../models/enums.dart';
import '../../models/match_entry.dart';
import '../../services/chat_service.dart';
import '../../services/matching_service.dart';
import '../../widgets/ads/banner_ad_slot.dart';
import '../../widgets/app_button.dart';
import '../../widgets/nav_bar.dart';
import '../../widgets/stat_pill.dart';

/// Matches screen: port of the previous Expo app's `app/matches.tsx`.
class MatchesScreen extends ConsumerStatefulWidget {
  const MatchesScreen({super.key});

  @override
  ConsumerState<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends ConsumerState<MatchesScreen> {
  List<MatchEntry> _matches = const [];
  bool _loading = true;
  String? _busyId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _refresh());
  }

  Future<void> _refresh() async {
    setState(() => _loading = true);
    try {
      final matches = await ref.read(matchingServiceProvider).getMyMatches();
      if (mounted) setState(() => _matches = matches);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _handleAccept(String matchId) async {
    setState(() => _busyId = matchId);
    try {
      await ref.read(matchingServiceProvider).acceptMatch(matchId);
      await _refresh();
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  Future<void> _handleReject(String matchId) async {
    setState(() => _busyId = matchId);
    try {
      await ref.read(matchingServiceProvider).rejectMatch(matchId);
      await _refresh();
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  Future<void> _handleEngaged(String matchId) async {
    setState(() => _busyId = matchId);
    try {
      await ref.read(matchingServiceProvider).markEngaged(matchId);
      await _refresh();
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  Future<void> _openChat(String matchId) async {
    setState(() => _busyId = matchId);
    try {
      final conversation =
          await ref.read(chatServiceProvider).getOrCreateConversation(matchId);
      if (mounted) context.push('/chat/${conversation.id}?matchId=$matchId');
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).matches;

    String statusLabel(MatchStatus status) {
      switch (status) {
        case MatchStatus.pending:
          return dict.statusPending;
        case MatchStatus.accepted:
          return dict.statusAccepted;
        case MatchStatus.rejected:
          return dict.statusRejected;
        case MatchStatus.engaged:
          return dict.statusEngaged;
        case MatchStatus.unknown:
          return '';
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const NavBar(),
            const SizedBox(height: 14),
            Text(dict.title,
                style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.emerald700)),
            const SizedBox(height: 14),
            const BannerAdSlot(placement: BannerPlacement.bannerMatches),
            const SizedBox(height: 10),
            if (!_loading && _matches.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Text(dict.empty,
                    textAlign: TextAlign.center,
                    style:
                        const TextStyle(fontSize: 13, color: AppColors.ink500)),
              ),
            for (final match in _matches) ...[
              _MatchRow(
                match: match,
                statusLabel: statusLabel(match.status),
                busy: _busyId == match.id,
                dict: dict,
                onAccept: () => _handleAccept(match.id),
                onReject: () => _handleReject(match.id),
                onChat: () => _openChat(match.id),
                onEngaged: () => _handleEngaged(match.id),
              ),
              const SizedBox(height: 10),
            ],
          ],
        ),
      ),
    );
  }
}

class _MatchRow extends StatelessWidget {
  const _MatchRow({
    required this.match,
    required this.statusLabel,
    required this.busy,
    required this.dict,
    required this.onAccept,
    required this.onReject,
    required this.onChat,
    required this.onEngaged,
  });

  final MatchEntry match;
  final String statusLabel;
  final bool busy;
  final MatchesDict dict;
  final VoidCallback onAccept;
  final VoidCallback onReject;
  final VoidCallback onChat;
  final VoidCallback onEngaged;

  StatPillVariant get _statusVariant {
    switch (match.status) {
      case MatchStatus.pending:
        return StatPillVariant.gold;
      case MatchStatus.accepted:
      case MatchStatus.engaged:
        return StatPillVariant.emerald;
      case MatchStatus.rejected:
        return StatPillVariant.rose;
      case MatchStatus.unknown:
        return StatPillVariant.emerald;
    }
  }

  @override
  Widget build(BuildContext context) {
    final photos = match.otherUser.profile.photos;
    final photoUri = photos.isNotEmpty
        ? photos.first
        : 'https://placehold.co/100x100/eef6f0/2f7a52?text=Z';
    final directionLabel = match.direction == MatchDirection.sent
        ? dict.directionSent
        : dict.directionReceived;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: AppColors.emerald900.withOpacity(0.08),
              blurRadius: 16,
              offset: const Offset(0, 6)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(26),
            child: Image.network(
              photoUri,
              width: 52,
              height: 52,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  Container(width: 52, height: 52, color: AppColors.emerald50),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  match.otherUser.profile.firstName,
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.emerald900),
                ),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    StatPill(
                        icon: Icons.circle,
                        label: statusLabel,
                        variant: _statusVariant),
                    Text(directionLabel,
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.ink500)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              if (match.status == MatchStatus.pending &&
                  match.direction == MatchDirection.received) ...[
                AppButton(
                    label: dict.accept,
                    variant: AppButtonVariant.gold,
                    onPressed: busy ? null : onAccept),
                AppButton(
                    label: dict.reject,
                    variant: AppButtonVariant.ghost,
                    onPressed: busy ? null : onReject),
              ],
              if (match.status == MatchStatus.accepted ||
                  match.status == MatchStatus.engaged) ...[
                AppButton(label: dict.chat, onPressed: busy ? null : onChat),
                if (match.status == MatchStatus.accepted)
                  AppButton(
                      label: dict.markEngaged,
                      variant: AppButtonVariant.gold,
                      onPressed: busy ? null : onEngaged),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
