import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/ad_settings.dart';
import '../services/ad_settings_service.dart';

/// Cached, fetch-once-per-app-session provider for the remote ad config.
///
/// Mirrors the previous Expo app's `src/store/adSettings.store.ts` zustand
/// store: `fetch()` was a no-op once `fetched` was true, and a failed fetch
/// (e.g. logged out, offline) just left ads off rather than surfacing an
/// error anywhere. A [FutureProvider] gives the same behavior for free —
/// it's evaluated once and cached for the provider's lifetime (the whole app
/// session, since nothing disposes it), and errors are caught here so ads
/// simply stay off instead of putting the provider into an error state that
/// ad-consuming widgets would have to handle separately.
final adSettingsProvider = FutureProvider<AdSettings?>((ref) async {
  try {
    return await ref.watch(adSettingsServiceProvider).getAdSettings();
  } catch (_) {
    return null;
  }
});
