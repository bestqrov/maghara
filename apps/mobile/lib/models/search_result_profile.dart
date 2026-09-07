import 'enums.dart';

/// Mirrors `SearchResultProfile['profile']` from the old
/// `apps/mobile/src/services/matching.service.ts`.
class SearchResultProfileDetails {
  const SearchResultProfileDetails({
    required this.firstName,
    required this.gender,
    required this.birthDate,
    required this.residenceCountry,
    required this.currentCity,
    required this.originCountry,
    required this.relocationPreference,
    required this.photos,
    this.jobTitle,
    this.bio,
  });

  final String firstName;
  final Gender gender;
  final String birthDate;
  final String residenceCountry;
  final String currentCity;
  final String originCountry;
  final RelocationPreference relocationPreference;
  final String? jobTitle;
  final String? bio;
  final List<String> photos;

  factory SearchResultProfileDetails.fromJson(Map<String, dynamic> json) => SearchResultProfileDetails(
        firstName: json['firstName'] as String,
        gender: Gender.fromJson(json['gender'] as String?),
        birthDate: json['birthDate'] as String,
        residenceCountry: json['residenceCountry'] as String,
        currentCity: json['currentCity'] as String,
        originCountry: json['originCountry'] as String,
        relocationPreference: RelocationPreference.fromJson(json['relocationPreference'] as String?),
        jobTitle: json['jobTitle'] as String?,
        bio: json['bio'] as String?,
        photos: (json['photos'] as List<dynamic>? ?? const []).cast<String>(),
      );

  Map<String, dynamic> toJson() => {
        'firstName': firstName,
        'gender': gender.toJson(),
        'birthDate': birthDate,
        'residenceCountry': residenceCountry,
        'currentCity': currentCity,
        'originCountry': originCountry,
        'relocationPreference': relocationPreference.toJson(),
        if (jobTitle != null) 'jobTitle': jobTitle,
        if (bio != null) 'bio': bio,
        'photos': photos,
      };
}

/// Mirrors `SearchResultProfile` from the old
/// `apps/mobile/src/services/matching.service.ts`, returned by
/// `GET /matching/search`.
class SearchResultProfile {
  const SearchResultProfile({
    required this.id,
    required this.isVerified,
    required this.verificationStatus,
    required this.subscriptionTier,
    required this.blurred,
    required this.profile,
  });

  final String id;
  final bool isVerified;
  final String verificationStatus;
  final String subscriptionTier;
  final bool blurred;
  final SearchResultProfileDetails profile;

  factory SearchResultProfile.fromJson(Map<String, dynamic> json) => SearchResultProfile(
        id: json['_id'] as String,
        isVerified: json['isVerified'] as bool? ?? false,
        verificationStatus: json['verificationStatus'] as String? ?? 'UNVERIFIED',
        subscriptionTier: json['subscriptionTier'] as String? ?? 'FREE',
        blurred: json['blurred'] as bool? ?? false,
        profile: SearchResultProfileDetails.fromJson(json['profile'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'isVerified': isVerified,
        'verificationStatus': verificationStatus,
        'subscriptionTier': subscriptionTier,
        'blurred': blurred,
        'profile': profile.toJson(),
      };
}
