import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import { colors } from '@/theme/colors';
import { useAppOpenAd } from '@/hooks/useAppOpenAd';

export default function RootLayout() {
  useEffect(() => {
    mobileAds().initialize();
  }, []);

  useAppOpenAd();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}
