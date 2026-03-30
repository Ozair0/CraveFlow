import Constants from 'expo-constants';
import { router } from 'expo-router';
import { View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function AboutScreen() {
  const theme = useAppTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="About CraveFlow"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: 8,
          ...theme.shadow.card,
        }}>
        <AppText variant="heading">CraveFlow</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          A polished food ordering and reservation experience built from a screenshot-led design reconstruction.
        </AppText>
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
        <View style={{ gap: 6 }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Version
          </AppText>
          <AppText variant="label">{version}</AppText>
        </View>
        <View style={{ gap: 6 }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Experience
          </AppText>
          <AppText variant="body" color={theme.colors.textMuted}>
            Delivery, live order tracking, saved favorites, restaurant bookings, coupons, notifications, and full light/dark theming.
          </AppText>
        </View>
        <View style={{ gap: 6 }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Build Notes
          </AppText>
          <AppText variant="body" color={theme.colors.textMuted}>
            This project uses Expo Router, a typed mock data layer, reusable UI primitives, and AsyncStorage-backed app state for a realistic demo workflow.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
