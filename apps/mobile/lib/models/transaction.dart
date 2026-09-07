import 'enums.dart';

/// Mirrors `Transaction` from the old
/// `apps/mobile/src/services/payments.service.ts`, returned by
/// `GET /payments/transactions/me`.
class Transaction {
  const Transaction({
    required this.id,
    required this.amount,
    required this.currency,
    required this.paymentMethod,
    this.txHashOrReceipt,
    required this.type,
    required this.status,
    required this.createdAt,
  });

  final String id;
  final num amount;
  final String currency;
  final PaymentMethod paymentMethod;
  final String? txHashOrReceipt;
  final TransactionType type;
  final TransactionStatus status;
  final String createdAt;

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: json['_id'] as String,
        amount: json['amount'] as num,
        currency: json['currency'] as String,
        paymentMethod: PaymentMethod.fromJson(json['paymentMethod'] as String?),
        txHashOrReceipt: json['txHashOrReceipt'] as String?,
        type: TransactionType.fromJson(json['type'] as String?),
        status: TransactionStatus.fromJson(json['status'] as String?),
        createdAt: json['createdAt'] as String,
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'amount': amount,
        'currency': currency,
        'paymentMethod': paymentMethod.toJson(),
        if (txHashOrReceipt != null) 'txHashOrReceipt': txHashOrReceipt,
        'type': type.toJson(),
        'status': status.toJson(),
        'createdAt': createdAt,
      };
}
