import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_input.dart';
import '../../widgets/icon_badge.dart';

/// Port of the old Expo `app/(auth)/login.tsx`.
///
/// Visual identity: a circular emerald badge with two overlapping ring
/// outlines (gold + white), overlapping the top edge of a white, rounded,
/// shadowed card — matching the redesigned Expo login screen.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _onSubmit() async {
    setState(() {
      _error = null;
      _loading = true;
    });

    final dict = ref.read(appDictProvider);
    try {
      final response = await ref.read(authServiceProvider).login(
            LoginPayload(phoneNumber: _phoneController.text.trim(), password: _passwordController.text),
          );
      await ref.read(authStoreProvider.notifier).setSession(response.accessToken, response.user);
      if (mounted) context.go('/');
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.statusCode == 401 ? dict.login.errorInvalid : dict.common.errorGeneric;
      });
    } catch (_) {
      setState(() => _error = dict.common.errorGeneric);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).login;

    return Scaffold(
      backgroundColor: AppColors.emerald50,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 380),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 32),
                  Stack(
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
                              offset: const Offset(0, 12),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              dict.title,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.emerald700),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              dict.subtitle,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 13, color: AppColors.ink500),
                            ),
                            const SizedBox(height: 20),
                            AppInput(
                              label: dict.phoneLabel,
                              placeholder: dict.phonePlaceholder,
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                            ),
                            const SizedBox(height: 14),
                            AppInput(label: dict.passwordLabel, controller: _passwordController, obscureText: true),
                            if (_error != null) ...[
                              const SizedBox(height: 14),
                              Text(
                                _error!,
                                textAlign: TextAlign.center,
                                style: const TextStyle(fontSize: 13, color: AppColors.red500),
                              ),
                            ],
                            const SizedBox(height: 18),
                            AppButton(label: dict.submit, loading: _loading, onPressed: _loading ? null : _onSubmit),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(dict.noAccount, style: const TextStyle(fontSize: 13, color: AppColors.ink500)),
                                GestureDetector(
                                  onTap: () => context.go('/register'),
                                  child: Text(
                                    dict.registerLink,
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.emerald600),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const RingsBadge(),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
