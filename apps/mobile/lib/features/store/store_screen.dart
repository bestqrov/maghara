import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/i18n/dictionary.dart';
import '../../core/i18n/locale_provider.dart';
import '../../core/theme/colors.dart';
import '../../models/enums.dart';
import '../../models/transaction.dart';
import '../../services/payments_service.dart';
import '../../services/website_links.dart';
import '../../widgets/app_button.dart';
import '../../widgets/nav_bar.dart';

/// Port of the previous Expo app's `app/store.tsx`.
///
/// No real in-app purchase flow: both "Top up" and "Upgrade to VIP" simply
/// open the marketing website's `/store` page (coin/VIP purchases were
/// moved off the app entirely, see commit 6c21465).
class StoreScreen extends ConsumerStatefulWidget {
  const StoreScreen({super.key});

  @override
  ConsumerState<StoreScreen> createState() => _StoreScreenState();
}

class _StoreScreenState extends ConsumerState<StoreScreen> {
  List<Transaction> _transactions = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    try {
      final transactions = await ref.read(paymentsServiceProvider).getMyTransactions();
      if (mounted) setState(() => _transactions = transactions);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _openStoreOnWebsite() async {
    final locale = ref.read(localeControllerProvider).languageCode;
    final url = Uri.parse(websiteUrl(locale, '/store'));
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).store;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const NavBar(),
            const SizedBox(height: 14),
            Text(dict.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.emerald700)),
            const SizedBox(height: 4),
            Text(dict.websiteNotice, style: const TextStyle(fontSize: 12, color: AppColors.ink500)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(22)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(dict.coinPackagesTitle, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.emerald900)),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      for (var i = 0; i < coinPackages.length; i++) ...[
                        Expanded(
                          child: _CoinPackageTile(
                            coins: coinPackages[i].coins,
                            priceLabel: i < dict.coinPriceLabels.length ? dict.coinPriceLabels[i] : coinPackages[i].priceLabel,
                          ),
                        ),
                        if (i != coinPackages.length - 1) const SizedBox(width: 8),
                      ],
                    ],
                  ),
                  const SizedBox(height: 10),
                  AppButton(label: dict.topUp, variant: AppButtonVariant.gold, onPressed: _openStoreOnWebsite),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: AppColors.emerald900, borderRadius: BorderRadius.circular(22)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${dict.vipPlanLabel} 👑', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.white)),
                  const SizedBox(height: 4),
                  Text(dict.vipPerks, style: const TextStyle(fontSize: 12, color: AppColors.emerald100)),
                  const SizedBox(height: 6),
                  Text(dict.vipPricePerMonth, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gold300)),
                  const SizedBox(height: 6),
                  AppButton(label: dict.upgradeNow, variant: AppButtonVariant.gold, onPressed: _openStoreOnWebsite),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text(dict.historyTitle, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.emerald900)),
            if (!_loading && _transactions.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Text(dict.historyEmpty, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: AppColors.ink500)),
              ),
            const SizedBox(height: 8),
            for (final transaction in _transactions) ...[
              _TransactionRow(transaction: transaction, dict: dict),
              const SizedBox(height: 8),
            ],
          ],
        ),
      ),
    );
  }
}

class _CoinPackageTile extends StatelessWidget {
  const _CoinPackageTile({required this.coins, required this.priceLabel});

  final int coins;
  final String priceLabel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.emerald100),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text('🪙 $coins', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.emerald700)),
          const SizedBox(height: 6),
          Text(priceLabel, style: const TextStyle(fontSize: 11, color: AppColors.ink500)),
        ],
      ),
    );
  }
}

class _StatusStyle {
  const _StatusStyle(this.label, this.bg, this.fg);
  final String label;
  final Color bg;
  final Color fg;
}

_StatusStyle _statusStyle(TransactionStatus status, StoreDict dict) {
  switch (status) {
    case TransactionStatus.pending:
      return _StatusStyle(dict.statusPending, AppColors.gold100, AppColors.emerald900);
    case TransactionStatus.success:
      return _StatusStyle(dict.statusSuccess, AppColors.emerald50, AppColors.emerald700);
    case TransactionStatus.failed:
    case TransactionStatus.unknown:
      return _StatusStyle(dict.statusFailed, AppColors.rose100, const Color(0xFFDC2626));
  }
}

String _typeLabel(TransactionType type, StoreDict dict) {
  switch (type) {
    case TransactionType.coinPurchase:
      return dict.typeCoinPurchase;
    case TransactionType.vipSubscription:
      return dict.typeVipSubscription;
    case TransactionType.verificationFee:
      return dict.typeVerificationFee;
    case TransactionType.unknown:
      return '';
  }
}

class _TransactionRow extends StatelessWidget {
  const _TransactionRow({required this.transaction, required this.dict});

  final Transaction transaction;
  final StoreDict dict;

  @override
  Widget build(BuildContext context) {
    final status = _statusStyle(transaction.status, dict);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(16)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(_typeLabel(transaction.type, dict), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700)),
              const SizedBox(height: 2),
              Text('${transaction.amount} ${transaction.currency}', style: const TextStyle(fontSize: 12, color: AppColors.ink500)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: status.bg, borderRadius: BorderRadius.circular(999)),
            child: Text(status.label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: status.fg)),
          ),
        ],
      ),
    );
  }
}
