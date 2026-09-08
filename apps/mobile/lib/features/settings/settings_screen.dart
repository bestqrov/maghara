import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';
import '../../models/app_config.dart';
import '../../services/app_config_service.dart';
import '../../services/users_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_input.dart';
import '../../widgets/chip_card.dart';
import '../../widgets/nav_bar.dart';
import 'widgets/language_selector.dart';

/// Port of the previous Expo app's `app/settings.tsx`.
class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String? _error;
  bool _success = false;
  bool _loading = false;

  AppConfigData? _appConfig;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadAppConfig());
  }

  Future<void> _loadAppConfig() async {
    try {
      final config = await ref.read(appConfigServiceProvider).getAppConfig();
      if (mounted) setState(() => _appConfig = config);
    } catch (_) {
      // Best-effort: conditional links just stay hidden if this fails.
    }
  }

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submitChangePassword() async {
    final dict = ref.read(appDictProvider).settings;
    setState(() {
      _error = null;
      _success = false;
    });

    final newPassword = _newPasswordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (newPassword.length < 8) {
      setState(() => _error = dict.errorPasswordTooShort);
      return;
    }
    if (newPassword != confirmPassword) {
      setState(() => _error = dict.errorPasswordMismatch);
      return;
    }

    setState(() => _loading = true);
    try {
      await ref.read(usersServiceProvider).changePassword(
            currentPassword: _currentPasswordController.text,
            newPassword: newPassword,
          );
      if (mounted) {
        setState(() => _success = true);
        _currentPasswordController.clear();
        _newPasswordController.clear();
        _confirmPasswordController.clear();
      }
    } on DioException catch (e) {
      final dictCommon = ref.read(appDictProvider).common;
      if (mounted) {
        setState(() => _error = e.response?.statusCode == 401
            ? dict.errorWrongPassword
            : dictCommon.errorGeneric);
      }
    } catch (_) {
      final dictCommon = ref.read(appDictProvider).common;
      if (mounted) setState(() => _error = dictCommon.errorGeneric);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _openLink(String? url) async {
    if (url == null || url.isEmpty) return;
    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  Future<void> _showDeleteAccountDialog() async {
    final router = GoRouter.of(context);
    await showDialog<void>(
      context: context,
      builder: (context) => _DeleteAccountDialog(
        onDeleted: () async {
          await ref.read(authStoreProvider.notifier).logout();
          router.go('/login');
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).settings;
    final config = _appConfig;
    final hasLinks = config != null &&
        ((config.privacyPolicy.url?.isNotEmpty ?? false) ||
            (config.termsConditions.url?.isNotEmpty ?? false) ||
            (config.moreAppsLink?.isNotEmpty ?? false));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const NavBar(),
            const SizedBox(height: 14),
            Text(dict.title,
                style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.emerald700)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                      color: AppColors.emerald900.withOpacity(0.08),
                      blurRadius: 20,
                      offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(dict.changePasswordTitle,
                      style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: AppColors.emerald700)),
                  const SizedBox(height: 2),
                  Text(dict.changePasswordSubtitle,
                      style: const TextStyle(
                          fontSize: 13, color: AppColors.ink500)),
                  const SizedBox(height: 14),
                  AppInput(
                      label: dict.currentPasswordLabel,
                      controller: _currentPasswordController,
                      obscureText: true),
                  const SizedBox(height: 14),
                  AppInput(
                      label: dict.newPasswordLabel,
                      controller: _newPasswordController,
                      obscureText: true),
                  const SizedBox(height: 14),
                  AppInput(
                      label: dict.confirmPasswordLabel,
                      controller: _confirmPasswordController,
                      obscureText: true),
                  if (_error != null) ...[
                    const SizedBox(height: 10),
                    Text(_error!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.red500)),
                  ],
                  if (_success) ...[
                    const SizedBox(height: 10),
                    Text(dict.success,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.emerald600)),
                  ],
                  const SizedBox(height: 14),
                  AppButton(
                      label: dict.save,
                      loading: _loading,
                      onPressed: _submitChangePassword),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ChipCard(
              variant: ChipCardVariant.row,
              icon: Icons.language_rounded,
              label: dict.languageTitle,
              onTap: () => showLanguageSelector(context),
              trailing: const Icon(Icons.chevron_right_rounded,
                  color: AppColors.ink500),
            ),
            if (hasLinks) ...[
              if (config.privacyPolicy.url?.isNotEmpty ?? false) ...[
                const SizedBox(height: 10),
                ChipCard(
                  variant: ChipCardVariant.row,
                  icon: Icons.shield_outlined,
                  label: dict.privacyPolicyLink,
                  onTap: () => _openLink(config.privacyPolicy.url),
                  trailing: const Icon(Icons.chevron_right_rounded,
                      color: AppColors.ink500),
                ),
              ],
              if (config.termsConditions.url?.isNotEmpty ?? false) ...[
                const SizedBox(height: 10),
                ChipCard(
                  variant: ChipCardVariant.row,
                  icon: Icons.description_outlined,
                  label: dict.termsLink,
                  onTap: () => _openLink(config.termsConditions.url),
                  trailing: const Icon(Icons.chevron_right_rounded,
                      color: AppColors.ink500),
                ),
              ],
              if (config.moreAppsLink?.isNotEmpty ?? false) ...[
                const SizedBox(height: 10),
                ChipCard(
                  variant: ChipCardVariant.row,
                  icon: Icons.apps_rounded,
                  label: dict.moreAppsLink,
                  onTap: () => _openLink(config.moreAppsLink),
                  trailing: const Icon(Icons.chevron_right_rounded,
                      color: AppColors.ink500),
                ),
              ],
            ],
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.rose50,
                borderRadius: BorderRadius.circular(28),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(dict.deleteAccountSubtitle,
                      style: const TextStyle(
                          fontSize: 12, color: AppColors.ink500)),
                  const SizedBox(height: 10),
                  ChipCard(
                    variant: ChipCardVariant.row,
                    icon: Icons.delete_forever_rounded,
                    label: dict.deleteAccountTitle,
                    iconBackground: AppColors.rose100,
                    iconColor: AppColors.red500,
                    onTap: _showDeleteAccountDialog,
                    trailing: const Icon(Icons.chevron_right_rounded,
                        color: AppColors.red400),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DeleteAccountDialog extends ConsumerStatefulWidget {
  const _DeleteAccountDialog({required this.onDeleted});

  final Future<void> Function() onDeleted;

  @override
  ConsumerState<_DeleteAccountDialog> createState() =>
      _DeleteAccountDialogState();
}

class _DeleteAccountDialogState extends ConsumerState<_DeleteAccountDialog> {
  final _passwordController = TextEditingController();
  String? _error;
  bool _loading = false;
  String _password = '';

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _confirm() async {
    final dict = ref.read(appDictProvider).settings;
    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      await ref
          .read(usersServiceProvider)
          .deleteAccount(password: _passwordController.text);
      if (mounted) {
        Navigator.of(context).pop();
        await widget.onDeleted();
      }
    } on DioException catch (e) {
      final dictCommon = ref.read(appDictProvider).common;
      if (mounted) {
        setState(() => _error = e.response?.statusCode == 401
            ? dict.deleteAccountErrorWrongPassword
            : dictCommon.errorGeneric);
      }
    } catch (_) {
      final dictCommon = ref.read(appDictProvider).common;
      if (mounted) setState(() => _error = dictCommon.errorGeneric);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).settings;

    return Dialog(
      backgroundColor: AppColors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(dict.deleteAccountConfirmTitle,
                style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.red500)),
            const SizedBox(height: 8),
            Text(dict.deleteAccountConfirmBody,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: AppColors.ink700)),
            const SizedBox(height: 12),
            AppInput(
              label: dict.deleteAccountPasswordLabel,
              controller: _passwordController,
              obscureText: true,
              onChanged: (value) => setState(() => _password = value),
            ),
            if (_error != null) ...[
              const SizedBox(height: 8),
              Text(_error!,
                  textAlign: TextAlign.center,
                  style:
                      const TextStyle(fontSize: 13, color: AppColors.red500)),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    label: dict.deleteAccountCancel,
                    variant: AppButtonVariant.ghost,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: AppButton(
                    label: dict.deleteAccountConfirm,
                    variant: AppButtonVariant.danger,
                    loading: _loading,
                    onPressed: _password.isEmpty ? null : _confirm,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
