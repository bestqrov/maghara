import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/i18n/locale_provider.dart';
import '../../core/storage/auth_store.dart';
import '../../core/theme/colors.dart';

/// Temporary home/placeholder screen.
///
/// A later task replaces this with the real discover/search feed. For now
/// it only proves the authenticated shell + logout round-trip works.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'قسمة و نصيب',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.emerald700),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  await ref.read(authStoreProvider.notifier).logout();
                  if (context.mounted) context.go('/login');
                },
                child: Text(dict.common.logout),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
