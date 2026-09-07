import 'enums.dart';

/// Mirrors `VerificationStatusResponse['verificationDocuments']` from the old
/// `apps/mobile/src/services/verification.service.ts`.
class VerificationDocuments {
  const VerificationDocuments({this.idDocumentUrl, this.residencyDocumentUrl, this.rejectionReason, this.submittedAt});

  final String? idDocumentUrl;
  final String? residencyDocumentUrl;
  final String? rejectionReason;
  final String? submittedAt;

  factory VerificationDocuments.fromJson(Map<String, dynamic> json) => VerificationDocuments(
        idDocumentUrl: json['idDocumentUrl'] as String?,
        residencyDocumentUrl: json['residencyDocumentUrl'] as String?,
        rejectionReason: json['rejectionReason'] as String?,
        submittedAt: json['submittedAt'] as String?,
      );

  Map<String, dynamic> toJson() => {
        if (idDocumentUrl != null) 'idDocumentUrl': idDocumentUrl,
        if (residencyDocumentUrl != null) 'residencyDocumentUrl': residencyDocumentUrl,
        if (rejectionReason != null) 'rejectionReason': rejectionReason,
        if (submittedAt != null) 'submittedAt': submittedAt,
      };
}

/// Mirrors `VerificationStatusResponse` from the old
/// `apps/mobile/src/services/verification.service.ts`, returned by
/// `GET /verification/me`.
class VerificationStatusResponse {
  const VerificationStatusResponse({
    required this.isVerified,
    required this.verificationStatus,
    this.verificationDocuments,
  });

  final bool isVerified;
  final VerificationStatusValue verificationStatus;
  final VerificationDocuments? verificationDocuments;

  factory VerificationStatusResponse.fromJson(Map<String, dynamic> json) => VerificationStatusResponse(
        isVerified: json['isVerified'] as bool? ?? false,
        verificationStatus: VerificationStatusValue.fromJson(json['verificationStatus'] as String?),
        verificationDocuments: json['verificationDocuments'] == null
            ? null
            : VerificationDocuments.fromJson(json['verificationDocuments'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        'isVerified': isVerified,
        'verificationStatus': verificationStatus.toJson(),
        if (verificationDocuments != null) 'verificationDocuments': verificationDocuments!.toJson(),
      };
}
