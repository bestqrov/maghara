import { ReactNode, useEffect } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import * as Application from 'expo-application';
import * as ScreenCapture from 'expo-screen-capture';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { useAppConfigStore } from '@/store/appConfig.store';
import { useAppDict } from '@/hooks/useLocale';

function getNativeVersionCode(): number {
  const raw = Application.nativeBuildVersion;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function AppGate({ children }: { children: ReactNode }) {
  const { dict } = useAppDict();
  const { config, checked, fetch } = useAppConfigStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!checked) return;
    if (config?.appSettings.screenshotBlock) {
      ScreenCapture.preventScreenCaptureAsync();
    } else {
      ScreenCapture.allowScreenCaptureAsync();
    }
  }, [checked, config?.appSettings.screenshotBlock]);

  if (!checked) return null;

  if (config?.appSettings.maintenanceMode) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🛠️</Text>
        <Text style={styles.title}>{dict.appGate.maintenanceTitle}</Text>
        <Text style={styles.message}>{config.appSettings.maintenanceMessage || dict.appGate.maintenanceDefaultMessage}</Text>
      </View>
    );
  }

  if (config?.appUpdate.enabled && getNativeVersionCode() < config.appUpdate.requiredVersionCode) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⬆️</Text>
        <Text style={styles.title}>{dict.appGate.updateTitle}</Text>
        <Text style={styles.message}>{config.appUpdate.description || dict.appGate.updateDefaultMessage}</Text>
        {!!config.appUpdate.appLink && (
          <Button onPress={() => Linking.openURL(config.appUpdate.appLink!)} style={styles.button}>
            {dict.appGate.updateButton}
          </Button>
        )}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background, gap: 10 },
  emoji: { fontSize: 48 },
  title: { fontSize: 18, fontWeight: '800', color: colors.emerald700, textAlign: 'center' },
  message: { fontSize: 14, color: colors.ink500, textAlign: 'center' },
  button: { marginTop: 12, minWidth: 180 },
});
