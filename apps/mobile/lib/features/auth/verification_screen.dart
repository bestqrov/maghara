import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/theme/colors.dart';
import '../../models/enums.dart';
import '../../models/verification_status.dart';
import '../../services/verification_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/icon_badge.dart';
import 'widgets/image_uploader.dart';

/// Port of the old Expo `app/verification.tsx`.
///
/// A 401 while fetching status shouldn't normally happen (the router guards
/// this route), but if it does, this screen doesn't hand-roll a redirect —
/// it just shows a generic failed-to-load state and lets the API client's
/// 401 interceptor (which logs the user out) and the router's redirect
/// take over on the next rebuild.
class VerificationScreen extends ConsumerStatefulWidget {
  const VerificationScreen({super.key});

  @override
  ConsumerState<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends ConsumerState<VerificationScreen> {
  VerificationStatusResponse? _status;
  bool _loadingStatus = true;
  String? _idDocumentUrl;
  String? _residencyDocumentUrl;
  String? _error;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _fetchStatus();
  }

  Future<void> _fetchStatus() async {
    setState(() => _loadingStatus = true);
    try {
      final status =
          await ref.read(verificationServiceProvider).getMyVerificationStatus();
      if (mounted) setState(() => _status = status);
    } catch (_) {
      // See class doc: a 401 here is handled by the API client's
      // interceptor + router redirect, not locally.
      if (mounted) setState(() => _status = null);
    } finally {
      if (mounted) setState(() => _loadingStatus = false);
    }
  }

  Future<void> _onSubmit() async {
    final dict = ref.read(appDictProvider).common;
    setState(() {
      _error = null;
      _submitting = true;
    });
    try {
      await ref.read(verificationServiceProvider).submitVerification(
            idDocumentUrl: _idDocumentUrl!,
            residencyDocumentUrl: _residencyDocumentUrl,
          );
      await _fetchStatus();
    } catch (_) {
      if (mounted) setState(() => _error = dict.errorGeneric);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).verification;

    final alreadySubmitted =
        _status?.verificationStatus == VerificationStatusValue.pending ||
            _status?.verificationStatus == VerificationStatusValue.verified;

    return Scaffold(
      backgroundColor: AppColors.emerald50,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 380),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                        color: AppColors.emerald900.withOpacity(0.12),
                        blurRadius: 24,
                        offset: const Offset(0, 12)),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const IconBadge(
                      background: AppColors.gold100,
                      size: 56,
                      borderWidth: 0,
                      icon: Icon(Icons.verified_user_rounded,
                          color: AppColors.gold600, size: 26),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      dict.title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.emerald700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      dict.subtitle,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontSize: 13, color: AppColors.ink500),
                    ),
                    const SizedBox(height: 18),
                    if (_loadingStatus)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 24),
                        child: CircularProgressIndicator(
                            color: AppColors.emerald600),
                      )
                    else if (alreadySubmitted)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                            color: AppColors.emerald50,
                            borderRadius: BorderRadius.circular(14)),
                        child: Text(
                          _status?.verificationStatus ==
                                  VerificationStatusValue.verified
                              ? dict.alreadyVerified
                              : dict.alreadyPending,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 13, color: AppColors.emerald700),
                        ),
                      )
                    else ...[
                      ImageUploader(
                        label: dict.idLabel,
                        folder: 'zawaj/verification',
                        onUploaded: (url) =>
                            setState(() => _idDocumentUrl = url),
                      ),
                      const SizedBox(height: 14),
                      ImageUploader(
                        label: dict.residencyLabel,
                        folder: 'zawaj/verification',
                        onUploaded: (url) =>
                            setState(() => _residencyDocumentUrl = url),
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 14),
                        Text(_error!,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.red500)),
                      ],
                      const SizedBox(height: 18),
                      SizedBox(
                        width: double.infinity,
                        child: AppButton(
                          label: dict.submit,
                          loading: _submitting,
                          onPressed: (_idDocumentUrl == null || _submitting)
                              ? null
                              : _onSubmit,
                        ),
                      ),
                    ],
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: AppButton(
                        label: dict.skip,
                        variant: AppButtonVariant.ghost,
                        onPressed: () => context.go('/'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
