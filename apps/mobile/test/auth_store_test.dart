import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:app/core/storage/auth_store.dart';
import 'package:app/models/auth_user.dart';
import 'package:app/models/enums.dart';

const _user = AuthUser(
  id: 'u1',
  phoneNumber: '+212600000000',
  subscriptionTier: SubscriptionTier.free,
  profile: UserProfile(
    firstName: 'Sara',
    gender: Gender.female,
    birthDate: '1998-01-01',
    residenceCountry: 'MA',
    currentCity: 'Casablanca',
    originCountry: 'MA',
    relocationPreference: RelocationPreference.localOnly,
    photos: [],
    isPhotoBlurred: false,
  ),
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('hydrates with no session when storage is empty', () async {
    SharedPreferences.setMockInitialValues({});
    final container = ProviderContainer();
    addTearDown(container.dispose);

    // Wait for the async hydration kicked off in AuthStore's constructor.
    await container.read(authStoreProvider.notifier).hydrated;

    final state = container.read(authStoreProvider);
    expect(state.hasHydrated, isTrue);
    expect(state.token, isNull);
    expect(state.user, isNull);
    expect(state.isAuthenticated, isFalse);
  });

  test('setSession persists token and user, logout clears them', () async {
    SharedPreferences.setMockInitialValues({});
    final container = ProviderContainer();
    addTearDown(container.dispose);
    await container.read(authStoreProvider.notifier).hydrated;

    await container.read(authStoreProvider.notifier).setSession('tok-123', _user);

    var state = container.read(authStoreProvider);
    expect(state.token, 'tok-123');
    expect(state.user?.id, 'u1');
    expect(state.isAuthenticated, isTrue);

    // A fresh store reading the same (mocked) SharedPreferences backing
    // store should rehydrate the persisted session.
    final container2 = ProviderContainer();
    addTearDown(container2.dispose);
    await container2.read(authStoreProvider.notifier).hydrated;

    final rehydrated = container2.read(authStoreProvider);
    expect(rehydrated.hasHydrated, isTrue);
    expect(rehydrated.token, 'tok-123');
    expect(rehydrated.user?.phoneNumber, '+212600000000');

    await container.read(authStoreProvider.notifier).logout();
    state = container.read(authStoreProvider);
    expect(state.token, isNull);
    expect(state.user, isNull);
    expect(state.isAuthenticated, isFalse);
  });
}
