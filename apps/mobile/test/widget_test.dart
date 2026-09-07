// Basic smoke test for the scaffolded app: verifies the placeholder screen
// renders once the locale store has hydrated, wrapped in a ProviderScope.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/main.dart';

void main() {
  testWidgets('renders placeholder screen after hydration', (WidgetTester tester) async {
    // The locale provider reads shared_preferences on startup; the plugin
    // needs a mocked backend to resolve in a widget test.
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(const ProviderScope(child: MyApp()));

    // First frame shows the splash (with an indefinitely-animating spinner,
    // so we can't use pumpAndSettle) while shared_preferences hydrates.
    // A handful of pumps is enough for the hydration future to resolve.
    for (var i = 0; i < 10; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.textContaining('Flutter scaffold OK'), findsOneWidget);
  });
}
