import 'package:flutter_test/flutter_test.dart';

import 'package:app/models/app_config.dart';
import 'package:app/models/conversation.dart';
import 'package:app/models/enums.dart';

void main() {
  group('Conversation', () {
    test('round-trips through JSON', () {
      final json = {
        '_id': 'c1',
        'matchId': 'm1',
        'participants': ['u1', 'u2'],
        'totalMessagesCount': 7,
        'isLockedForFree': true,
        'unlockedBy': ['u1'],
        'lastMessageAt': '2026-01-01T00:00:00.000Z',
      };

      final conversation = Conversation.fromJson(json);

      expect(conversation.id, 'c1');
      expect(conversation.matchId, 'm1');
      expect(conversation.participants, ['u1', 'u2']);
      expect(conversation.totalMessagesCount, 7);
      expect(conversation.isLockedForFree, isTrue);
      expect(conversation.unlockedBy, ['u1']);
      expect(conversation.toJson(), json);
    });
  });

  group('AppConfigData', () {
    test('round-trips through JSON, including nested objects', () {
      final json = {
        'general': {'email': 'hi@example.com'},
        'appSettings': {'maintenanceMode': false, 'screenshotBlock': true},
        'privacyPolicy': {'url': 'https://example.com/privacy'},
        'termsConditions': {'content': 'terms text'},
        'appUpdate': {
          'enabled': true,
          'requiredVersionCode': 12,
          'appLink': 'https://play.google.com/x',
        },
        'moreAppsLink': 'https://example.com/apps',
      };

      final config = AppConfigData.fromJson(json);

      expect(config.general.email, 'hi@example.com');
      expect(config.appSettings.maintenanceMode, isFalse);
      expect(config.appSettings.screenshotBlock, isTrue);
      expect(config.privacyPolicy.url, 'https://example.com/privacy');
      expect(config.termsConditions.content, 'terms text');
      expect(config.appUpdate.enabled, isTrue);
      expect(config.appUpdate.requiredVersionCode, 12);
      expect(config.moreAppsLink, 'https://example.com/apps');
      expect(config.toJson(), json);
    });

    test('fills in defaults for missing nested objects', () {
      final config = AppConfigData.fromJson(const {});

      expect(config.appSettings.maintenanceMode, isFalse);
      expect(config.appUpdate.requiredVersionCode, 0);
      expect(config.moreAppsLink, isNull);
    });
  });

  group('enums', () {
    test('Gender.fromJson falls back to unknown for unrecognized values', () {
      expect(Gender.fromJson('MALE'), Gender.male);
      expect(Gender.fromJson('nonsense'), Gender.unknown);
      expect(Gender.fromJson(null), Gender.unknown);
    });

    test('MatchStatus round-trips its wire values', () {
      for (final status in MatchStatus.values) {
        expect(MatchStatus.fromJson(status.toJson()), status);
      }
    });
  });
}
