// Shared enum types mirroring the backend's string enums, plus small
// helpers for parsing them defensively (an unrecognized value from the
// server falls back to a sentinel `unknown` member rather than throwing).

/// `MALE` / `FEMALE` as returned by the backend.
enum Gender {
  male('MALE'),
  female('FEMALE'),
  unknown('UNKNOWN');

  const Gender(this.wire);
  final String wire;

  static Gender fromJson(String? value) =>
      Gender.values.firstWhere((e) => e.wire == value, orElse: () => Gender.unknown);

  String toJson() => wire;
}

enum SubscriptionTier {
  free('FREE'),
  vip('VIP'),
  crossBorderVip('CROSS_BORDER_VIP'),
  unknown('UNKNOWN');

  const SubscriptionTier(this.wire);
  final String wire;

  static SubscriptionTier fromJson(String? value) =>
      SubscriptionTier.values.firstWhere((e) => e.wire == value, orElse: () => SubscriptionTier.unknown);

  String toJson() => wire;
}

enum RelocationPreference {
  openToMove('OPEN_TO_MOVE'),
  lookingForExpat('LOOKING_FOR_EXPAT'),
  localOnly('LOCAL_ONLY'),
  unknown('UNKNOWN');

  const RelocationPreference(this.wire);
  final String wire;

  static RelocationPreference fromJson(String? value) => RelocationPreference.values
      .firstWhere((e) => e.wire == value, orElse: () => RelocationPreference.unknown);

  String toJson() => wire;
}

enum SearchScope {
  local('LOCAL'),
  diaspora('DIASPORA');

  const SearchScope(this.wire);
  final String wire;

  String toJson() => wire;
}

enum MatchStatus {
  pending('PENDING'),
  accepted('ACCEPTED'),
  rejected('REJECTED'),
  engaged('ENGAGED'),
  unknown('UNKNOWN');

  const MatchStatus(this.wire);
  final String wire;

  static MatchStatus fromJson(String? value) =>
      MatchStatus.values.firstWhere((e) => e.wire == value, orElse: () => MatchStatus.unknown);

  String toJson() => wire;
}

enum MatchDirection {
  sent('SENT'),
  received('RECEIVED'),
  unknown('UNKNOWN');

  const MatchDirection(this.wire);
  final String wire;

  static MatchDirection fromJson(String? value) =>
      MatchDirection.values.firstWhere((e) => e.wire == value, orElse: () => MatchDirection.unknown);

  String toJson() => wire;
}

enum VerificationStatusValue {
  unverified('UNVERIFIED'),
  pending('PENDING'),
  verified('VERIFIED'),
  rejected('REJECTED'),
  unknown('UNKNOWN');

  const VerificationStatusValue(this.wire);
  final String wire;

  static VerificationStatusValue fromJson(String? value) => VerificationStatusValue.values
      .firstWhere((e) => e.wire == value, orElse: () => VerificationStatusValue.unknown);

  String toJson() => wire;
}

enum PaymentMethod {
  cryptoTrc20('CRYPTO_TRC20'),
  cryptoPolygon('CRYPTO_POLYGON'),
  cryptoSolana('CRYPTO_SOLANA'),
  bankTransfer('BANK_TRANSFER'),
  cashPlus('CASH_PLUS');

  const PaymentMethod(this.wire);
  final String wire;

  static PaymentMethod fromJson(String? value) =>
      PaymentMethod.values.firstWhere((e) => e.wire == value, orElse: () => PaymentMethod.cashPlus);

  String toJson() => wire;
}

enum TransactionType {
  coinPurchase('COIN_PURCHASE'),
  vipSubscription('VIP_SUBSCRIPTION'),
  verificationFee('VERIFICATION_FEE'),
  unknown('UNKNOWN');

  const TransactionType(this.wire);
  final String wire;

  static TransactionType fromJson(String? value) =>
      TransactionType.values.firstWhere((e) => e.wire == value, orElse: () => TransactionType.unknown);

  String toJson() => wire;
}

enum TransactionStatus {
  pending('PENDING'),
  success('SUCCESS'),
  failed('FAILED'),
  unknown('UNKNOWN');

  const TransactionStatus(this.wire);
  final String wire;

  static TransactionStatus fromJson(String? value) =>
      TransactionStatus.values.firstWhere((e) => e.wire == value, orElse: () => TransactionStatus.unknown);

  String toJson() => wire;
}
