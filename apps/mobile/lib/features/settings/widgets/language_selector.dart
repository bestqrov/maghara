import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';

class _LanguageMeta {
  const _LanguageMeta(this.code, this.flag, this.nativeName);

  final String code;
  final String flag;
  final String nativeName;
}

/// Port of the previous Expo app's `src/components/LanguageSelector.tsx`.
///
/// Renders as the content of a modal bottom sheet (see [showLanguageSelector]),
/// listing the four supported locales with a flag + native name; tapping one
/// sets the active locale via [localeControllerProvider] and closes.
class LanguageSelector extends ConsumerWidget {
  const LanguageSelector({super.key});

  static const _languages = [
    _LanguageMeta('ar', '🇲🇦', 'العربية'),
    _LanguageMeta('fr', '🇫🇷', 'Français'),
    _LanguageMeta('en', '🇬🇧', 'English'),
    _LanguageMeta('es', '🇪🇸', 'Español'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider).languageSelector;
    final activeLocale = ref.watch(localeControllerProvider).languageCode;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                dict.title,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.emerald700),
              ),
            ),
            for (final language in _languages)
              _LanguageOption(
                language: language,
                active: language.code == activeLocale,
                onTap: () {
                  ref.read(localeControllerProvider.notifier).setLocale(language.code);
                  Navigator.of(context).pop();
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _LanguageOption extends StatelessWidget {
  const _LanguageOption({required this.language, required this.active, required this.onTap});

  final _LanguageMeta language;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.emerald50 : Colors.transparent,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
          child: Row(
            children: [
              Text(language.flag, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 10),
              Text(
                language.nativeName,
                style: TextStyle(
                  fontSize: 14,
                  color: active ? AppColors.emerald700 : AppColors.ink700,
                  fontWeight: active ? FontWeight.w700 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Opens [LanguageSelector] as a modal bottom sheet. Shared by `NavBar`
/// (globe icon, reachable from every screen that shows the nav bar) and the
/// settings screen's language row.
Future<void> showLanguageSelector(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    backgroundColor: AppColors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (context) => const LanguageSelector(),
  );
}
