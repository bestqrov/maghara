import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/i18n/locale_provider.dart';
import '../core/theme/colors.dart';
import '../features/settings/widgets/language_selector.dart';

/// Port of the previous Expo app's `src/components/NavBar.tsx`, redesigned
/// with filled rounded icons and a colored pill behind the active tab,
/// matching the reference UI-kit's bottom nav. Navigation behavior (routes,
/// language selector trigger) is unchanged.
class NavBar extends ConsumerWidget {
  const NavBar({super.key});

  void _go(BuildContext context, String href) {
    context.go(href);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dict = ref.watch(appDictProvider).nav;
    final currentLocation = GoRouterState.of(context).uri.path;

    final links = [
      (href: '/', label: dict.search, icon: Icons.search_rounded),
      (href: '/visitors', label: dict.visitors, icon: Icons.visibility_rounded),
      (href: '/matches', label: dict.matches, icon: Icons.favorite_rounded),
      (href: '/store', label: dict.store, icon: Icons.storefront_rounded),
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: AppColors.emerald900.withOpacity(0.08), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      child: Row(
        children: [
          for (final link in links)
            Expanded(
              child: _NavTab(
                icon: link.icon,
                label: link.label,
                active: currentLocation == link.href,
                onTap: () => _go(context, link.href),
              ),
            ),
          Expanded(
            child: _NavTab(
              icon: Icons.settings_rounded,
              label: null,
              active: currentLocation == '/settings',
              onTap: () => _go(context, '/settings'),
            ),
          ),
          Expanded(
            child: _NavTab(
              icon: Icons.language_rounded,
              label: null,
              active: false,
              onTap: () => showLanguageSelector(context),
            ),
          ),
        ],
      ),
    );
  }
}

/// A single bottom-nav tab: a filled rounded icon, with a colored pill
/// background behind it when [active], plus an optional short label below.
class _NavTab extends StatelessWidget {
  const _NavTab({required this.icon, required this.label, required this.active, required this.onTap});

  final IconData icon;
  final String? label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                curve: Curves.easeOut,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: active ? AppColors.emerald50 : Colors.transparent,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, size: 22, color: active ? AppColors.emerald700 : AppColors.ink500),
              ),
              if (label != null) ...[
                const SizedBox(height: 2),
                Text(
                  label!,
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: active ? AppColors.emerald700 : AppColors.ink500,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
