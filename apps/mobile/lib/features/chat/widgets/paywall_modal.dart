import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../services/chat_service.dart';
import '../../../widgets/app_button.dart';

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
          decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(28)),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: const BoxDecoration(color: AppColors.gold100, shape: BoxShape.circle),
                alignment: Alignment.center,
                child: const Text('💬', style: TextStyle(fontSize: 24)),
              ),
              const SizedBox(height: 12),
              Text(
                dict.title,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.emerald700),
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
                child: AppButton(label: dict.upgradeVip, variant: AppButtonVariant.gold, onPressed: loading ? null : onUpgradeVip),
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
                child: AppButton(label: dict.close, variant: AppButtonVariant.ghost, onPressed: loading ? null : onClose),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
