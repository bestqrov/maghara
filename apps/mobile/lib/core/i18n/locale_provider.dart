import 'dart:ui';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'dictionary.dart';

/// Persistence key, kept identical to the previous Expo app's zustand store
/// (`zawaj-locale`) so any shared understanding of the setting carries over.
const String _localeStorageKey = 'zawaj-locale';

const String defaultLocaleCode = 'ar';
const List<String> supportedLocaleCodes = ['ar', 'fr', 'en', 'es'];

bool isRtlLocaleCode(String code) => code == 'ar';

/// Riverpod controller for the active app locale.
///
/// Mirrors the Expo `locale.store.ts` zustand+AsyncStorage pattern: the
/// locale is persisted under `zawaj-locale`, defaults to `'ar'`, and exposes
/// a `hasHydrated` flag so the app shell can avoid flashing the wrong
/// direction/strings before storage has loaded.
class LocaleController extends StateNotifier<Locale> {
  LocaleController(this._ref) : super(const Locale(defaultLocaleCode)) {
    _hydrate();
  }

  final Ref _ref;

  Future<void> _hydrate() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getString(_localeStorageKey);
      if (stored != null && supportedLocaleCodes.contains(stored)) {
        state = Locale(stored);
      }
    } finally {
      _ref.read(localeHasHydratedProvider.notifier).state = true;
    }
  }

  Future<void> setLocale(String code) async {
    if (!supportedLocaleCodes.contains(code)) return;
    state = Locale(code);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_localeStorageKey, code);
  }

  bool get isRTL => isRtlLocaleCode(state.languageCode);
}

final localeControllerProvider = StateNotifierProvider<LocaleController, Locale>((ref) {
  return LocaleController(ref);
});

/// Whether the persisted locale has finished loading from storage. The app
/// shell should gate first paint on this to avoid a flash of the wrong
/// direction/strings, mirroring the Expo `hasHydrated` pattern.
final localeHasHydratedProvider = StateProvider<bool>((ref) => false);

/// Whether the current locale is RTL (Arabic).
final isRtlProvider = Provider<bool>((ref) {
  final locale = ref.watch(localeControllerProvider);
  return isRtlLocaleCode(locale.languageCode);
});

/// The active dictionary, derived from the current locale.
final appDictProvider = Provider<AppDictionary>((ref) {
  final locale = ref.watch(localeControllerProvider);
  return appDictionaries[locale.languageCode] ?? arDictionary;
});
