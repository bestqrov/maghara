import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../services/chat_service.dart';
import '../../../widgets/app_button.dart';
import '../../../widgets/icon_badge.dart';

/// Port of the previous Expo app's `src/components/PaywallModal.tsx`.
class PaywallModal extends ConsumerWidget {
  const PaywallModal({
    super.key,
    required this.onUnlockWithCoins,
    required this.onUpgradeVip,
    required this.onClose,
    required this.loading,
  });

  final VoidCallback onUnlockWithCoins;
  final VoidCallback onUpgradeVip;
  final VoidCallback onClose;
  final bool loading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider).paywallModal;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 340),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                  color: AppColors.emerald900.withOpacity(0.18),
                  blurRadius: 28,
                  offset: const Offset(0, 14)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const IconBadge(
                background: AppColors.gold100,
                size: 56,
                borderWidth: 0,
                icon: Icon(Icons.lock_rounded,
                    color: AppColors.gold600, size: 26),
              ),
              const SizedBox(height: 12),
              Text(
                dict.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: AppColors.emerald700),
              ),
              const SizedBox(height: 6),
              Text(
                dict.body(ChatService.unlockCoinCost),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: AppColors.ink500),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                    label: dict.upgradeVip,
                    variant: AppButtonVariant.gold,
                    onPressed: loading ? null : onUpgradeVip),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: dict.unlockWithCoins(ChatService.unlockCoinCost),
                  loading: loading,
                  onPressed: onUnlockWithCoins,
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                    label: dict.close,
                    variant: AppButtonVariant.ghost,
                    onPressed: loading ? null : onClose),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
