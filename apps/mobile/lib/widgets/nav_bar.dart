import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/i18n/locale_provider.dart';
import '../core/theme/colors.dart';

/// Port of the previous Expo app's `src/components/NavBar.tsx`.
///
/// `/visitors`, `/store` and `/settings` aren't built yet (later tasks), so
/// tapping those tabs shows a "coming soon" snackbar instead of navigating
/// to a route that doesn't exist yet. The language-globe icon is likewise a
/// placeholder until the language selector modal is built.
class NavBar extends ConsumerWidget {
  const NavBar({super.key});

  static const _implementedRoutes = {'/', '/matches'};

  void _go(BuildContext context, String href) {
    if (_implementedRoutes.contains(href)) {
      context.go(href);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Coming soon')),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider).nav;
    final currentLocation = GoRouterState.of(context).uri.path;

    final links = [
      (href: '/', label: dict.search),
      (href: '/visitors', label: dict.visitors),
      (href: '/matches', label: dict.matches),
      (href: '/store', label: dict.store),
    ];

    return Container(
      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(16)),
      padding: const EdgeInsets.all(6),
      child: Row(
        children: [
          for (final link in links)
            Expanded(
              child: _NavTab(
                label: link.label,
                active: currentLocation == link.href,
                onTap: () => _go(context, link.href),
              ),
            ),
          _NavIconTab(
            icon: dict.settingsIcon,
            active: currentLocation == '/settings',
            onTap: () => _go(context, '/settings'),
          ),
          _NavIconTab(
            icon: '🌐',
            active: false,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Coming soon')),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _NavTab extends StatelessWidget {
  const _NavTab({required this.label, required this.active, required this.onTap});

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.emerald600 : Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: active ? AppColors.white : AppColors.emerald700,
            ),
          ),
        ),
      ),
    );
  }
}

class _NavIconTab extends StatelessWidget {
  const _NavIconTab({required this.icon, required this.active, required this.onTap});

  final String icon;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.emerald600 : Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
          child: Text(
            icon,
            style: TextStyle(fontSize: 13, color: active ? AppColors.white : AppColors.emerald700),
          ),
        ),
      ),
    );
  }
}
