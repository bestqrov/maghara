import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/theme/colors.dart';
import '../../models/enums.dart';
import '../../models/verification_status.dart';
import '../../services/verification_service.dart';
import '../../widgets/app_button.dart';
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
  String _documentType = 'ID_CARD';
  String? _idDocumentUrl;
  String? _selfieUrl;
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
      final status = await ref.read(verificationServiceProvider).getMyVerificationStatus();
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
            documentType: _documentType,
            idDocumentUrl: _idDocumentUrl!,
            selfieUrl: _selfieUrl!,
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
                    BoxShadow(color: AppColors.emerald900.withOpacity(0.12), blurRadius: 24, offset: const Offset(0, 12)),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: const BoxDecoration(color: AppColors.gold100, shape: BoxShape.circle),
                      alignment: Alignment.center,
                      child: const Text('🛡️', style: TextStyle(fontSize: 26)),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      dict.title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.emerald700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      dict.subtitle,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 13, color: AppColors.ink500),
                    ),
                    const SizedBox(height: 18),
                    if (_loadingStatus)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 24),
                        child: CircularProgressIndicator(color: AppColors.emerald600),
                      )
                    else if (alreadySubmitted)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(14)),
                        child: Text(
                          _status?.verificationStatus == VerificationStatusValue.verified
                              ? dict.alreadyVerified
                              : dict.alreadyPending,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 13, color: AppColors.emerald700),
                        ),
                      )
                    else ...[
                      if (_status?.verificationStatus == VerificationStatusValue.rejected) ...[
                        Text(dict.rejected, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: AppColors.red500)),
                        const SizedBox(height: 14),
                      ],
                      for (var i = 0; i < dict.steps.length; i++)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                alignment: Alignment.center,
                                decoration: const BoxDecoration(color: AppColors.emerald50, shape: BoxShape.circle),
                                child: Text('${i + 1}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.emerald700)),
                              ),
                              const SizedBox(width: 10),
                              Expanded(child: Text(dict.steps[i], style: const TextStyle(fontSize: 13, color: AppColors.ink700))),
                            ],
                          ),
                        ),
                      const SizedBox(height: 4),
                      Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: Text(dict.docTypeLabel, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700)),
                      ),
                      const SizedBox(height: 6),
                      SegmentedButton<String>(
                        segments: [
                          ButtonSegment(value: 'ID_CARD', label: Text(dict.idCard)),
                          ButtonSegment(value: 'PASSPORT', label: Text(dict.passport)),
                        ],
                        selected: {_documentType},
                        showSelectedIcon: false,
                        onSelectionChanged: (selection) => setState(() => _documentType = selection.first),
                      ),
                      const SizedBox(height: 14),
                      ImageUploader(
                        label: dict.idLabel,
                        folder: 'zawaj/verification',
                        onUploaded: (url) => setState(() => _idDocumentUrl = url),
                      ),
                      const SizedBox(height: 14),
                      // Camera only (front), so a saved photo of someone else can't be chosen.
                      ImageUploader(
                        label: dict.selfieLabel,
                        folder: 'zawaj/verification',
                        source: ImageSource.camera,
                        preferFrontCamera: true,
                        onUploaded: (url) => setState(() => _selfieUrl = url),
                      ),
                      const SizedBox(height: 6),
                      Text(dict.selfieHint, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.ink500)),
                      const SizedBox(height: 14),
                      ImageUploader(
                        label: dict.residencyLabel,
                        folder: 'zawaj/verification',
                        onUploaded: (url) => setState(() => _residencyDocumentUrl = url),
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 14),
                        Text(_error!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: AppColors.red500)),
                      ],
                      const SizedBox(height: 18),
                      SizedBox(
                        width: double.infinity,
                        child: AppButton(
                          label: dict.submit,
                          loading: _submitting,
                          onPressed: (_idDocumentUrl == null || _selfieUrl == null || _submitting) ? null : _onSubmit,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(dict.privacy, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.ink500)),
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
