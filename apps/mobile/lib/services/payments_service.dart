import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/network/api_client.dart';
import '../models/enums.dart';
import '../models/transaction.dart';

/// Presentation data for a purchasable coin package. Mirrors the
/// `COIN_PACKAGES` tuple from the old
/// `apps/mobile/src/services/payments.service.ts`.
class CoinPackage {
  const CoinPackage({required this.coins, required this.priceLabel});

  final int coins;
  final String priceLabel;
}

/// Matches `COIN_PACKAGES` from the TS source (coins / MAD price label).
const List<CoinPackage> coinPackages = [
  CoinPackage(coins: 10, priceLabel: '20 درهم'),
  CoinPackage(coins: 30, priceLabel: '50 درهم'),
  CoinPackage(coins: 100, priceLabel: '150 درهم'),
];

/// Presentation data for the VIP subscription plan. Mirrors `VIP_PLAN` from
/// the old `apps/mobile/src/services/payments.service.ts`.
class VipPlan {
  const VipPlan({required this.amount, required this.label, required this.priceLabel});

  final int amount;
  final String label;
  final String priceLabel;
}

/// Matches `VIP_PLAN` from the TS source.
const VipPlan vipPlan = VipPlan(amount: 99, label: 'VIP شهري', priceLabel: '99 درهم / الشهر');

/// Port of `apps/mobile/src/services/payments.service.ts`.
///
/// [createTransaction] is an intentional addition beyond what the old mobile
/// app called (coin/VIP purchases were moved to the website, see commit
/// 6c21465) but the NestJS backend still exposes `POST
/// /payments/transactions` and this task's plan explicitly calls out adding
/// a typed wrapper for it for completeness/future use, not as scope creep.
class PaymentsService {
  PaymentsService(this._dio);

  final Dio _dio;

  Future<List<Transaction>> getMyTransactions() async {
    final res = await _dio.get<List<dynamic>>('/payments/transactions/me');
    return res.data!.map((e) => Transaction.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Transaction> createTransaction({
    required num amount,
    required String currency,
    required PaymentMethod paymentMethod,
    required TransactionType type,
    String? txHashOrReceipt,
  }) async {
    final res = await _dio.post<Map<String, dynamic>>(
      '/payments/transactions',
      data: {
        'amount': amount,
        'currency': currency,
        'paymentMethod': paymentMethod.toJson(),
        'type': type.toJson(),
        if (txHashOrReceipt != null) 'txHashOrReceipt': txHashOrReceipt,
      },
    );
    return Transaction.fromJson(res.data!);
  }
}

final paymentsServiceProvider = Provider<PaymentsService>((ref) => PaymentsService(ref.watch(dioProvider)));
