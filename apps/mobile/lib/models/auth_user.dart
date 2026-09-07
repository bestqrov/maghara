import 'enums.dart';

/// Mirrors `UserProfile` embedded in `AuthUser` from the old
/// `apps/mobile/src/store/auth.store.ts` (see `AuthUser.profile`).
class UserProfile {
  const UserProfile({
    required this.firstName,
    required this.gender,
    required this.birthDate,
    required this.residenceCountry,
    required this.currentCity,
    required this.originCountry,
    required this.relocationPreference,
    required this.photos,
    required this.isPhotoBlurred,
    this.bio,
    this.jobTitle,
  });

  final String firstName;
  final Gender gender;
  final String birthDate;
  final String residenceCountry;
  final String currentCity;
  final String originCountry;
  final RelocationPreference relocationPreference;
  final List<String> photos;
  final bool isPhotoBlurred;
  final String? bio;
  final String? jobTitle;

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        firstName: json['firstName'] as String,
        gender: Gender.fromJson(json['gender'] as String?),
        birthDate: json['birthDate'] as String,
        residenceCountry: json['residenceCountry'] as String,
        currentCity: json['currentCity'] as String,
        originCountry: json['originCountry'] as String,
        relocationPreference: RelocationPreference.fromJson(json['relocationPreference'] as String?),
        photos: (json['photos'] as List<dynamic>? ?? const []).cast<String>(),
        isPhotoBlurred: json['isPhotoBlurred'] as bool? ?? false,
        bio: json['bio'] as String?,
        jobTitle: json['jobTitle'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'firstName': firstName,
        'gender': gender.toJson(),
        'birthDate': birthDate,
        'residenceCountry': residenceCountry,
        'currentCity': currentCity,
        'originCountry': originCountry,
        'relocationPreference': relocationPreference.toJson(),
        'photos': photos,
        'isPhotoBlurred': isPhotoBlurred,
        if (bio != null) 'bio': bio,
        if (jobTitle != null) 'jobTitle': jobTitle,
      };
}

/// Mirrors `AuthUser` from the old `apps/mobile/src/store/auth.store.ts`.
///
/// This is the minimal user shape returned by `/auth/register` and
/// `/auth/login`, and is what's persisted in the auth store.
class AuthUser {
  const AuthUser({
    required this.id,
    required this.phoneNumber,
    required this.subscriptionTier,
    required this.profile,
  });

  final String id;
  final String phoneNumber;
  final SubscriptionTier subscriptionTier;
  final UserProfile profile;

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
        id: json['id'] as String? ?? json['_id'] as String,
        phoneNumber: json['phoneNumber'] as String,
        subscriptionTier: SubscriptionTier.fromJson(json['subscriptionTier'] as String?),
        profile: UserProfile.fromJson(json['profile'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'phoneNumber': phoneNumber,
        'subscriptionTier': subscriptionTier.toJson(),
        'profile': profile.toJson(),
      };
}

/// Mirrors `FullUser` from the old `apps/mobile/src/services/users.service.ts`
/// (`FullUser extends AuthUser`), returned by `GET /users/me`.
///
/// Dart doesn't have TS's structural `extends` for plain data here, so this
/// duplicates the `AuthUser` fields and adds the extra ones. Note
/// `verificationStatus` is typed as a plain `string` in the TS source (not
/// the `VerificationStatusValue` union used by `verification.service.ts`),
/// so it's kept as a raw String here too.
class FullUser {
  const FullUser({
    required this.id,
    required this.phoneNumber,
    required this.subscriptionTier,
    required this.profile,
    required this.coinBalance,
    required this.dailyInterestsSent,
    required this.isVerified,
    required this.verificationStatus,
  });

  final String id;
  final String phoneNumber;
  final SubscriptionTier subscriptionTier;
  final UserProfile profile;
  final int coinBalance;
  final int dailyInterestsSent;
  final bool isVerified;
  final String verificationStatus;

  factory FullUser.fromJson(Map<String, dynamic> json) => FullUser(
        id: json['id'] as String? ?? json['_id'] as String,
        phoneNumber: json['phoneNumber'] as String,
        subscriptionTier: SubscriptionTier.fromJson(json['subscriptionTier'] as String?),
        profile: UserProfile.fromJson(json['profile'] as Map<String, dynamic>),
        coinBalance: (json['coinBalance'] as num).toInt(),
        dailyInterestsSent: (json['dailyInterestsSent'] as num).toInt(),
        isVerified: json['isVerified'] as bool? ?? false,
        verificationStatus: json['verificationStatus'] as String? ?? 'UNVERIFIED',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'phoneNumber': phoneNumber,
        'subscriptionTier': subscriptionTier.toJson(),
        'profile': profile.toJson(),
        'coinBalance': coinBalance,
        'dailyInterestsSent': dailyInterestsSent,
        'isVerified': isVerified,
        'verificationStatus': verificationStatus,
      };

  /// The minimal `AuthUser` view of this user (e.g. to update the auth
  /// store after refetching `/users/me`).
  AuthUser toAuthUser() => AuthUser(
        id: id,
        phoneNumber: phoneNumber,
        subscriptionTier: subscriptionTier,
        profile: profile,
      );
}
