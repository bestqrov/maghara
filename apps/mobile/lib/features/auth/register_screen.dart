import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/i18n/dictionary.dart';
import '../../core/i18n/locale_provider.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';
import '../../services/auth_service.dart';
import '../../services/users_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_input.dart';
import '../../widgets/icon_badge.dart';
import '../../widgets/option_picker.dart';
import '../../widgets/step_indicator.dart';
import 'widgets/image_uploader.dart';

const _totalSteps = 5;

/// Port of the old Expo `app/(auth)/register.tsx`: a 5-step registration
/// wizard.
class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  int _step = 0;
  String? _error;
  bool _submitting = false;
  bool _checkingPhone = false;

  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _residenceCountryController = TextEditingController();
  final _currentCityController = TextEditingController();
  final _originCountryController = TextEditingController();
  final _jobTitleController = TextEditingController();
  final _bioController = TextEditingController();

  String _gender = 'MALE';
  String _relocationPreference = 'OPEN_TO_MOVE';
  String? _photoUrl;

  bool get _isLastStep => _step == _totalSteps - 1;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    _firstNameController.dispose();
    _birthDateController.dispose();
    _residenceCountryController.dispose();
    _currentCityController.dispose();
    _originCountryController.dispose();
    _jobTitleController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  bool _validateStep() {
    switch (_step) {
      case 0:
        return _phoneController.text.trim().length >= 8 &&
            _passwordController.text.length >= 8;
      case 1:
        return _firstNameController.text.trim().length >= 2 &&
            _birthDateController.text.trim().isNotEmpty;
      case 2:
        return _residenceCountryController.text.trim().isNotEmpty &&
            _currentCityController.text.trim().isNotEmpty &&
            _originCountryController.text.trim().isNotEmpty;
      default:
        return true;
    }
  }

  Future<void> _goNext() async {
    final dict = ref.read(appDictProvider).register;
    if (!_validateStep()) {
      setState(() => _error = dict.errorFieldsRequired);
      return;
    }
    setState(() => _error = null);

    if (_step == 0) {
      setState(() => _checkingPhone = true);
      try {
        final available = await ref
            .read(authServiceProvider)
            .checkPhoneAvailability(_phoneController.text.trim());
        if (!available) {
          if (mounted) setState(() => _error = dict.errorPhoneTaken);
          return;
        }
      } catch (_) {
        // Best-effort: if the check itself fails, let the final submit
        // catch a real conflict (409) instead.
      } finally {
        if (mounted) setState(() => _checkingPhone = false);
      }
    }

    if (mounted) setState(() => _step = (_step + 1).clamp(0, _totalSteps - 1));
  }

  void _goBack() {
    setState(() {
      _error = null;
      _step = (_step - 1).clamp(0, _totalSteps - 1);
    });
  }

  Future<void> _onSubmit() async {
    final dict = ref.read(appDictProvider);
    setState(() {
      _error = null;
      _submitting = true;
    });

    try {
      final authResponse = await ref.read(authServiceProvider).register(
            RegisterPayload(
              phoneNumber: _phoneController.text.trim(),
              password: _passwordController.text,
              firstName: _firstNameController.text.trim(),
              gender: _gender,
              birthDate: _birthDateController.text.trim(),
              residenceCountry: _residenceCountryController.text.trim(),
              currentCity: _currentCityController.text.trim(),
              originCountry: _originCountryController.text.trim(),
            ),
          );
      await ref
          .read(authStoreProvider.notifier)
          .setSession(authResponse.accessToken, authResponse.user);

      final updatedUser = await ref.read(usersServiceProvider).updateProfile(
            UpdateProfilePayload(
              relocationPreference: _relocationPreference,
              jobTitle: _jobTitleController.text.trim(),
              bio: _bioController.text.trim(),
              photos: _photoUrl != null ? [_photoUrl!] : null,
            ),
          );
      await ref.read(authStoreProvider.notifier).updateUser(updatedUser);

      if (mounted) context.go('/verification');
    } on DioException catch (e) {
      // Note: unlike the old Expo app, this deliberately never surfaces raw
      // HTTP error bodies to the user — only a clean, generic message (plus
      // a specific one for the known 409 "phone taken" conflict).
      setState(() {
        _error = e.response?.statusCode == 409
            ? dict.register.errorPhoneTaken
            : dict.common.errorGeneric;
      });
    } catch (_) {
      setState(() => _error = dict.common.errorGeneric);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).register;
    final row = Directionality.of(context) == TextDirection.rtl
        ? TextDirection.rtl
        : TextDirection.ltr;

    return Scaffold(
      backgroundColor: AppColors.emerald50,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 380),
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.topCenter,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 32),
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(28, 44, 28, 28),
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
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          dict.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: AppColors.emerald700),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          dict.stepOf(_step + 1, _totalSteps),
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 13, color: AppColors.ink500),
                        ),
                        const SizedBox(height: 12),
                        StepIndicator(total: _totalSteps, current: _step),
                        const SizedBox(height: 20),
                        _buildStep(dict),
                        if (_error != null) ...[
                          const SizedBox(height: 14),
                          Text(_error!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontSize: 13, color: AppColors.red500)),
                        ],
                        const SizedBox(height: 18),
                        Row(
                          textDirection: row,
                          children: [
                            if (_step > 0) ...[
                              Expanded(
                                child: AppButton(
                                  label: dict.back,
                                  variant: AppButtonVariant.ghost,
                                  onPressed: (_submitting || _checkingPhone)
                                      ? null
                                      : _goBack,
                                ),
                              ),
                              const SizedBox(width: 12),
                            ],
                            Expanded(
                              child: _isLastStep
                                  ? AppButton(
                                      label: dict.submit,
                                      loading: _submitting,
                                      onPressed: _submitting ? null : _onSubmit)
                                  : AppButton(
                                      label: dict.next,
                                      loading: _checkingPhone,
                                      onPressed:
                                          _checkingPhone ? null : _goNext),
                            ),
                          ],
                        ),
                        if (_step == 0) ...[
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(dict.haveAccount,
                                  style: const TextStyle(
                                      fontSize: 13, color: AppColors.ink500)),
                              GestureDetector(
                                onTap: () => context.go('/login'),
                                child: Text(
                                  dict.loginLink,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.emerald600),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  const IconBadge(
                    icon: Icon(Icons.person_add_rounded,
                        color: AppColors.white, size: 28),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStep(RegisterDict dict) {
    switch (_step) {
      case 0:
        return Column(
          children: [
            AppInput(
              label: dict.phoneLabel,
              placeholder: dict.phonePlaceholder,
              controller: _phoneController,
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 14),
            AppInput(
                label: dict.passwordLabel,
                controller: _passwordController,
                obscureText: true),
          ],
        );
      case 1:
        return Column(
          children: [
            AppInput(
                label: dict.firstNameLabel, controller: _firstNameController),
            const SizedBox(height: 14),
            OptionPicker(
              label: dict.genderLabel,
              value: _gender,
              onChanged: (v) => setState(() => _gender = v),
              options: [
                AppOption(value: 'MALE', label: dict.genderMale),
                AppOption(value: 'FEMALE', label: dict.genderFemale),
              ],
            ),
            const SizedBox(height: 14),
            AppInput(
              label: dict.birthDateLabel,
              placeholder: dict.birthDatePlaceholder,
              controller: _birthDateController,
            ),
          ],
        );
      case 2:
        return Column(
          children: [
            AppInput(
              label: dict.residenceCountryLabel,
              placeholder: dict.residenceCountryPlaceholder,
              controller: _residenceCountryController,
            ),
            const SizedBox(height: 14),
            AppInput(
                label: dict.currentCityLabel,
                controller: _currentCityController),
            const SizedBox(height: 14),
            AppInput(
                label: dict.originCountryLabel,
                controller: _originCountryController),
          ],
        );
      case 3:
        return Column(
          children: [
            OptionPicker(
              label: dict.relocationLabel,
              value: _relocationPreference,
              onChanged: (v) => setState(() => _relocationPreference = v),
              options: [
                AppOption(value: 'OPEN_TO_MOVE', label: dict.relocationOpen),
                AppOption(
                    value: 'LOOKING_FOR_EXPAT', label: dict.relocationExpat),
                AppOption(value: 'LOCAL_ONLY', label: dict.relocationLocal),
              ],
            ),
            const SizedBox(height: 14),
            AppInput(
                label: dict.jobTitleLabel, controller: _jobTitleController),
            const SizedBox(height: 14),
            AppInput(
                label: dict.bioLabel, controller: _bioController, maxLines: 3),
          ],
        );
      default:
        return ImageUploader(
          label: dict.photoLabel,
          folder: 'zawaj/profiles',
          onUploaded: (url) => setState(() => _photoUrl = url),
        );
    }
  }
}
