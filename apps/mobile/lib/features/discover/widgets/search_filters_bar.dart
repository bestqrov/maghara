import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../services/matching_service.dart';
import '../../../widgets/app_button.dart';
import '../../../widgets/app_input.dart';

/// Port of the previous Expo app's `src/components/SearchFiltersBar.tsx`.
///
/// Switching the Local/Diaspora tab triggers a search immediately (matching
/// the old `selectTab` behavior); the submit button triggers a search with
/// the current field values.
class SearchFiltersBar extends ConsumerStatefulWidget {
  const SearchFiltersBar({super.key, required this.onSearch, required this.loading});

  final ValueChanged<SearchFilters> onSearch;
  final bool loading;

  @override
  ConsumerState<SearchFiltersBar> createState() => _SearchFiltersBarState();
}

enum _ScopeTab { local, diaspora }

class _SearchFiltersBarState extends ConsumerState<SearchFiltersBar> {
  _ScopeTab _tab = _ScopeTab.local;
  final _minAgeController = TextEditingController();
  final _maxAgeController = TextEditingController();
  final _targetCountryController = TextEditingController();
  final _targetCityController = TextEditingController();

  @override
  void dispose() {
    _minAgeController.dispose();
    _maxAgeController.dispose();
    _targetCountryController.dispose();
    _targetCityController.dispose();
    super.dispose();
  }

  void _submit([_ScopeTab? nextTab]) {
    final tab = nextTab ?? _tab;
    widget.onSearch(SearchFilters(
      minAge: int.tryParse(_minAgeController.text),
      maxAge: int.tryParse(_maxAgeController.text),
      targetCountry: _targetCountryController.text.isEmpty ? null : _targetCountryController.text,
      targetCity: _targetCityController.text.isEmpty ? null : _targetCityController.text,
      scope: tab == _ScopeTab.diaspora ? 'DIASPORA' : 'LOCAL',
    ));
  }

  void _selectTab(_ScopeTab tab) {
    setState(() => _tab = tab);
    _submit(tab);
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).searchFilters;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(22)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(12)),
            child: Row(
              children: [
                Expanded(
                  child: _TabButton(
                    label: dict.local,
                    active: _tab == _ScopeTab.local,
                    onTap: () => _selectTab(_ScopeTab.local),
                  ),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: _TabButton(
                    label: dict.diaspora,
                    active: _tab == _ScopeTab.diaspora,
                    onTap: () => _selectTab(_ScopeTab.diaspora),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: AppInput(
                  placeholder: dict.ageFrom,
                  controller: _minAgeController,
                  keyboardType: TextInputType.number,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: AppInput(
                  placeholder: dict.ageTo,
                  controller: _maxAgeController,
                  keyboardType: TextInputType.number,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: AppInput(placeholder: dict.country, controller: _targetCountryController)),
              const SizedBox(width: 10),
              Expanded(child: AppInput(placeholder: dict.city, controller: _targetCityController)),
            ],
          ),
          const SizedBox(height: 10),
          AppButton(label: dict.submit, loading: widget.loading, onPressed: () => _submit()),
        ],
      ),
    );
  }
}

class _TabButton extends StatelessWidget {
  const _TabButton({required this.label, required this.active, required this.onTap});

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.emerald600 : Colors.transparent,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: active ? AppColors.white : AppColors.emerald700,
            ),
          ),
        ),
      ),
    );
  }
}
