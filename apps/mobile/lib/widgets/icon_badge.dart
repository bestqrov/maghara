import 'package:flutter/material.dart';

import '../core/theme/colors.dart';

/// A circular colored badge, floating above a card or section header.
///
/// Generalizes the login screen's original `_RingsBadge`: a solid-color
/// circle with a white ring border and a soft drop shadow, wrapping an
/// arbitrary [icon] child (an [Icon], a [CustomPaint], initials text, etc).
///
/// Used as the reference UI-kit's "bold circular badge floating above the
/// card" motif, reused across screens (login, empty states, section
/// headers) instead of duplicating the login screen's private widget.
class IconBadge extends StatelessWidget {
  const IconBadge({
    super.key,
    required this.icon,
    this.background = AppColors.emerald600,
    this.size = 64,
    this.borderColor = AppColors.white,
    this.borderWidth = 3,
    this.shadow,
  });

  /// The content painted inside the badge circle (an [Icon], [CustomPaint],
  /// or any small widget).
  final Widget icon;

  /// Fill color of the circle. Defaults to the brand emerald.
  final Color background;

  /// Outer diameter of the circle.
  final double size;

  /// Ring border around the circle (defaults to white, matching the login
  /// screen's badge floating over a white card).
  final Color borderColor;
  final double borderWidth;

  /// Drop shadow beneath the badge. Defaults to a soft emerald shadow.
  final List<BoxShadow>? shadow;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: background,
        shape: BoxShape.circle,
        border: borderWidth > 0 ? Border.all(color: borderColor, width: borderWidth) : null,
        boxShadow: shadow ??
            [
              BoxShadow(color: AppColors.emerald900.withOpacity(0.25), blurRadius: 12, offset: const Offset(0, 4)),
            ],
      ),
      child: Center(child: icon),
    );
  }
}

/// Paints two overlapping wedding-ring outlines (gold + white by default),
/// matching the login screen's original motif. Reusable wherever an
/// [IconBadge] wants the "rings" icon instead of a Material [Icon].
class RingsPainter extends CustomPainter {
  const RingsPainter({
    this.leftColor = AppColors.gold300,
    this.rightColor = AppColors.white,
    this.strokeWidth = 2.6,
  });

  final Color leftColor;
  final Color rightColor;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final ringRadius = size.width * 0.19;

    final leftPaint = Paint()
      ..color = leftColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    final rightPaint = Paint()
      ..color = rightColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final leftCenter = center.translate(-ringRadius * 0.6, ringRadius * 0.2);
    final rightCenter = center.translate(ringRadius * 0.6, -ringRadius * 0.2);

    canvas.drawCircle(leftCenter, ringRadius, leftPaint);
    canvas.drawCircle(rightCenter, ringRadius, rightPaint);
  }

  @override
  bool shouldRepaint(covariant RingsPainter oldDelegate) =>
      oldDelegate.leftColor != leftColor || oldDelegate.rightColor != rightColor || oldDelegate.strokeWidth != strokeWidth;
}

/// Convenience: an [IconBadge] pre-configured with the [RingsPainter], i.e.
/// exactly the login screen's original badge.
class RingsBadge extends StatelessWidget {
  const RingsBadge({
    super.key,
    this.background = AppColors.emerald600,
    this.size = 64,
  });

  final Color background;
  final double size;

  @override
  Widget build(BuildContext context) {
    return IconBadge(
      background: background,
      size: size,
      icon: const SizedBox.expand(child: CustomPaint(painter: RingsPainter())),
    );
  }
}
