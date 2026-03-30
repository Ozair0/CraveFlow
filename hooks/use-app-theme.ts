import { useColorScheme } from 'react-native';

import { useAppState } from '@/providers/app-provider';
import { getAppTheme } from '@/theme/tokens';

export function useAppTheme() {
  const systemMode = useColorScheme();
  const { appState } = useAppState();
  const selectedMode = appState?.settings.themeMode ?? 'system';
  const resolvedMode = selectedMode === 'system' ? (systemMode ?? 'light') : selectedMode;

  return getAppTheme(resolvedMode);
}
