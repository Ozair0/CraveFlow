import { router } from 'expo-router';
import { Switch, View } from 'react-native';

import { MenuRow } from '@/components/cards/profile-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { appState, setThemeMode, togglePreference } = useAppState();

  if (!appState) {
    return null;
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Settings"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        }}>
        <AppText variant="title">Appearance</AppText>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <Chip
              key={mode}
              label={mode[0].toUpperCase() + mode.slice(1)}
              selected={appState.settings.themeMode === mode}
              onPress={() => setThemeMode(mode)}
            />
          ))}
        </View>
      </View>

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        }}>
        {[
          { key: 'pushNotifications', label: 'Push Notifications', value: appState.settings.pushNotifications },
          { key: 'emailNotifications', label: 'Email Notifications', value: appState.settings.emailNotifications },
          { key: 'locationEnabled', label: 'Location Access', value: appState.settings.locationEnabled },
        ].map((setting) => (
          <View
            key={setting.key}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText variant="label">{setting.label}</AppText>
            <Switch
              value={setting.value}
              onValueChange={() =>
                togglePreference(
                  setting.key as 'pushNotifications' | 'emailNotifications' | 'locationEnabled'
                )
              }
              trackColor={{
                false: theme.colors.borderStrong,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.card}
            />
          </View>
        ))}
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <MenuRow
          title="Help Center"
          subtitle="Support details, FAQs, and contact options"
          icon="help-buoy-outline"
          onPress={() => router.push('/(app)/help')}
        />
        <MenuRow
          title="Privacy & Terms"
          subtitle="Understand how CraveFlow handles data and orders"
          icon="document-text-outline"
          onPress={() => router.push('/(app)/legal')}
        />
        <MenuRow
          title="About CraveFlow"
          subtitle="Version, product overview, and build details"
          icon="information-circle-outline"
          onPress={() => router.push('/(app)/about')}
        />
      </View>
    </Screen>
  );
}
