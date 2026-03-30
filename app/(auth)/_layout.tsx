import { Redirect, Stack } from 'expo-router';

import { BootScreen } from '@/components/states/boot-screen';
import { useAppState } from '@/providers/app-provider';

export default function AuthLayout() {
  const { appState, isReady } = useAppState();

  if (!isReady || !appState) {
    return <BootScreen />;
  }

  if (appState.session.isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
