import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/auth/verification_screen.dart';
import '../../features/home/home_screen.dart';
import '../storage/auth_store.dart';

/// Adapts Riverpod's [authStoreProvider] state changes to a [Listenable] so
/// `go_router`'s `refreshListenable` can trigger redirect re-evaluation
/// whenever the authenticated flag flips (login/logout), without go_router
/// needing to know anything about Riverpod.
class _AuthRefreshNotifier extends ChangeNotifier {
  _AuthRefreshNotifier(Ref ref) {
    ref.listen<AuthState>(authStoreProvider, (previous, next) {
      if (previous?.isAuthenticated != next.isAuthenticated) {
        notifyListeners();
      }
    });
  }
}

const _authRoutes = {'/login', '/register'};

/// The app's router.
///
/// Redirect strategy: by the time this provider is read, [AppRouter]'s
/// caller (see `main.dart`) has already gated first paint on
/// `authStoreProvider`'s `hasHydrated` flag, so the redirect callback below
/// can safely read the auth state synchronously (no async wait needed here).
/// `refreshListenable` is wired to [_AuthRefreshNotifier] so that a
/// subsequent login/logout (which happens after hydration) still triggers
/// go_router to re-run the redirect and navigate accordingly.
final goRouterProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = _AuthRefreshNotifier(ref);
  ref.onDispose(refreshNotifier.dispose);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final isAuthenticated = ref.read(authStoreProvider).isAuthenticated;
      final onAuthRoute = _authRoutes.contains(state.matchedLocation);

      if (!isAuthenticated && !onAuthRoute) return '/login';
      if (isAuthenticated && onAuthRoute) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/verification', builder: (context, state) => const VerificationScreen()),
      GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
    ],
  );
});
