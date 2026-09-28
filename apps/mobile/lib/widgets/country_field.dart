import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/data/countries.dart';
import '../core/i18n/locale_provider.dart';
import '../core/theme/colors.dart';

/// Country picker styled like [AppInput]. Tapping opens a searchable list.
///
/// [controller] holds the canonical Arabic name the backend stores (see
/// [Country.ar]); only the displayed label follows the app locale. An older
/// free-text value that isn't in the list is shown as-is.
class CountryField extends ConsumerStatefulWidget {
  const CountryField({
    super.key,
    required this.controller,
    this.label,
    this.placeholder,
    this.clearable = false,
  });

  final TextEditingController controller;
  final String? label;
  final String? placeholder;

  /// Shows a clear button once a country is picked (used by search filters).
  final bool clearable;

  @override
  ConsumerState<CountryField> createState() => _CountryFieldState();
}

class _CountryFieldState extends ConsumerState<CountryField> {
  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() => setState(() {});

  Future<void> _pick(String locale) async {
    final picked = await showModalBottomSheet<Country>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (_) => _CountrySheet(locale: locale, title: widget.label ?? widget.placeholder),
    );
    if (picked != null) widget.controller.text = picked.ar;
  }

  @override
  Widget build(BuildContext context) {
    final locale = ref.watch(localeControllerProvider).languageCode;
    final textAlign = Directionality.of(context) == TextDirection.rtl ? TextAlign.right : TextAlign.left;
    final value = widget.controller.text;
    final match = kCountries.where((c) => c.ar == value);
    final display = value.isEmpty ? null : (match.isEmpty ? value : match.first.label(locale));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            textAlign: textAlign,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700),
          ),
          const SizedBox(height: 6),
        ],
        InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: () => _pick(locale),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.emerald100),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    display ?? widget.placeholder ?? '',
                    textAlign: textAlign,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 14, color: display == null ? AppColors.ink500 : AppColors.ink700),
                  ),
                ),
                if (widget.clearable && value.isNotEmpty)
                  GestureDetector(
                    onTap: widget.controller.clear,
                    child: const Icon(Icons.close, size: 18, color: AppColors.ink500),
                  )
                else
                  const Icon(Icons.expand_more, size: 20, color: AppColors.ink500),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _CountrySheet extends StatefulWidget {
  const _CountrySheet({required this.locale, this.title});

  final String locale;
  final String? title;

  @override
  State<_CountrySheet> createState() => _CountrySheetState();
}

class _CountrySheetState extends State<_CountrySheet> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final q = _query.trim().toLowerCase();
    // Match against every language, so typing "Kuwait" works in the Arabic UI too.
    final results = q.isEmpty
        ? kCountries
        : kCountries
            .where((c) => [c.ar, c.en, c.fr, c.es].any((name) => name.toLowerCase().contains(q)))
            .toList();

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: SizedBox(
          height: MediaQuery.of(context).size.height * 0.7,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: TextField(
                  autofocus: true,
                  onChanged: (v) => setState(() => _query = v),
                  decoration: InputDecoration(
                    hintText: widget.title,
                    prefixIcon: const Icon(Icons.search, color: AppColors.ink500),
                    filled: true,
                    fillColor: AppColors.emerald50,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: results.length,
                  itemBuilder: (context, i) {
                    final country = results[i];
                    return ListTile(
                      title: Text(
                        country.label(widget.locale),
                        style: const TextStyle(fontSize: 14, color: AppColors.ink700),
                      ),
                      onTap: () => Navigator.of(context).pop(country),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
