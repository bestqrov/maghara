import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../models/auth_user.dart';

/// Persistence key, kept identical to the previous Expo app's zustand+persist
/// store (`apps/mobile/src/store/auth.store.ts`, `name: 'zawaj-auth'`) so any
/// shared understanding of the setting carries over.
const String _authStorageKey = 'zawaj-auth';

/// Immutable snapshot of the auth store's state.
class AuthState {
  const AuthState({this.token, this.user, this.hasHydrated = false});

  final String? token;
  final AuthUser? user;
  final bool hasHydrated;

  bool get isAuthenticated => token != null && token!.isNotEmpty;

  AuthState copyWith({
    String? token,
    bool clearToken = false,
    AuthUser? user,
    bool clearUser = false,
    bool? hasHydrated,
  }) {
    return AuthState(
      token: clearToken ? null : (token ?? this.token),
      user: clearUser ? null : (user ?? this.user),
      hasHydrated: hasHydrated ?? this.hasHydrated,
    );
  }
}

/// Riverpod controller mirroring the Expo `auth.store.ts` zustand+persist
/// pattern: `{ token, user }` is persisted as one JSON blob under
/// `zawaj-auth`, and `hasHydrated` flips true once storage has been read
/// (even if there was nothing stored), so the app shell can gate first paint
/// on it.
class AuthStore extends StateNotifier<AuthState> {
  AuthStore() : super(const AuthState()) {
    _hydrationDone = _hydrate();
  }

  /// Resolves once initial hydration from storage has finished (whether or
  /// not there was anything to load). Mainly useful for tests; app code
  /// should prefer watching `state.hasHydrated`.
  late final Future<void> _hydrationDone;
  Future<void> get hydrated => _hydrationDone;

  Future<void> _hydrate() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_authStorageKey);
      if (raw != null) {
        final json = jsonDecode(raw) as Map<String, dynamic>;
        final token = json['token'] as String?;
        final userJson = json['user'] as Map<String, dynamic>?;
        if (mounted) {
          state = state.copyWith(
            token: token,
            user: userJson == null ? null : AuthUser.fromJson(userJson),
          );
        }
      }
    } catch (_) {
      // Corrupt or unreadable storage: fall back to a signed-out state
      // rather than blocking app startup.
    } finally {
      if (mounted) {
        state = state.copyWith(hasHydrated: true);
      }
    }
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _authStorageKey,
      jsonEncode({'token': state.token, 'user': state.user?.toJson()}),
    );
  }

  Future<void> setSession(String token, AuthUser user) async {
    state = state.copyWith(token: token, user: user);
    await _persist();
  }

  Future<void> updateUser(AuthUser user) async {
    state = state.copyWith(user: user);
    await _persist();
  }

  Future<void> logout() async {
    state = state.copyWith(clearToken: true, clearUser: true);
    await _persist();
  }
}

final authStoreProvider = StateNotifierProvider<AuthStore, AuthState>((ref) {
  return AuthStore();
});
