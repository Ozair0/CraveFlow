import { Redirect } from 'expo-router';

import { BootScreen } from '@/components/states/boot-screen';
import { useAppState } from '@/providers/app-provider';

export default function IndexScreen() {
  const { appState, isReady } = useAppState();

  if (!isReady || !appState) {
    return <BootScreen />;
  }

  if (!appState.session.hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!appState.session.isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
