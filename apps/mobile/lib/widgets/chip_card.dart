import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// Layout shape of a [ChipCard].
enum ChipCardVariant {
  /// A square-ish tile for grids: icon centered above a label, e.g. a
  /// settings menu grid or a store package grid.
  tile,

  /// A wide row: icon on the leading edge, label (and optional subtitle)
  /// filling the rest, e.g. a settings list row.
  row,
}

/// A rounded "chip" card: a colored icon in a circle/rounded-square sitting
/// on a soft tinted background, with a short label — the reference UI-kit's
/// grid-tile motif. Tappable, with a subtle press state.
///
/// Colors are always drawn from [AppColors] tints/shades (e.g. `gold100`
/// background behind a `gold600` icon) — pass the pair explicitly via
/// [iconBackground] / [iconColor] rather than introducing new hues.
class ChipCard extends StatefulWidget {
  const ChipCard({
    super.key,
    required this.icon,
    required this.label,
    this.subtitle,
    this.onTap,
    this.iconBackground = AppColors.emerald50,
    this.iconColor = AppColors.emerald600,
    this.tileBackground = AppColors.white,
    this.variant = ChipCardVariant.tile,
    this.trailing,
  });

  final IconData icon;
  final String label;
  final String? subtitle;
  final VoidCallback? onTap;

  /// Background of the small circle/rounded-square behind [icon].
  final Color iconBackground;

  /// Color of [icon] itself.
  final Color iconColor;

  /// Background of the whole card (the "soft tinted tile").
  final Color tileBackground;

  final ChipCardVariant variant;

  /// Optional trailing widget for the [ChipCardVariant.row] layout (e.g. a
  /// chevron or a [StatPill]).
  final Widget? trailing;

  @override
  State<ChipCard> createState() => _ChipCardState();
}

class _ChipCardState extends State<ChipCard> {
  bool _pressed = false;

  void _setPressed(bool value) {
    if (widget.onTap == null) return;
    setState(() => _pressed = value);
  }

  @override
  Widget build(BuildContext context) {
    final iconBadge = Container(
      width: widget.variant == ChipCardVariant.tile ? 48 : 44,
      height: widget.variant == ChipCardVariant.tile ? 48 : 44,
      decoration: BoxDecoration(color: widget.iconBackground, borderRadius: BorderRadius.circular(14)),
      child: Icon(widget.icon, color: widget.iconColor, size: 24),
    );

    final content = widget.variant == ChipCardVariant.tile
        ? Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              iconBadge,
              const SizedBox(height: 10),
              Text(
                widget.label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink700),
              ),
              if (widget.subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  widget.subtitle!,
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, color: AppColors.ink500),
                ),
              ],
            ],
          )
        : Row(
            children: [
              iconBadge,
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      widget.label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.ink700),
                    ),
                    if (widget.subtitle != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        widget.subtitle!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12, color: AppColors.ink500),
                      ),
                    ],
                  ],
                ),
              ),
              if (widget.trailing != null) ...[const SizedBox(width: 8), widget.trailing!],
            ],
          );

    return AnimatedScale(
      scale: _pressed ? 0.97 : 1,
      duration: const Duration(milliseconds: 100),
      child: Material(
        color: widget.tileBackground,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: widget.onTap,
          onHighlightChanged: _setPressed,
          child: Container(
            padding: widget.variant == ChipCardVariant.tile
                ? const EdgeInsets.symmetric(vertical: 16, horizontal: 10)
                : const EdgeInsets.symmetric(vertical: 14, horizontal: 14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.emerald100),
            ),
            child: content,
          ),
        ),
      ),
    );
  }
}
