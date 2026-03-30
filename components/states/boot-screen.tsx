import { ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

export function BootScreen() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={{
          width: 112,
          height: 112,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
        }}>
        <AppText variant="heading" color="#FFFFFF">
          CF
        </AppText>
      </LinearGradient>
      <AppText variant="title">CraveFlow</AppText>
      <AppText variant="caption" color={theme.colors.textMuted} style={{ marginTop: 6 }}>
        Fresh meals. Real-time delivery.
      </AppText>
      <ActivityIndicator
        size="small"
        color={theme.colors.primary}
        style={{ marginTop: theme.spacing.xl }}
      />
    </View>
  );
}
