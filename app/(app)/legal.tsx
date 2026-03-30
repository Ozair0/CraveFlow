import { router } from 'expo-router';
import { View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { useAppTheme } from '@/hooks/use-app-theme';

const sections = [
  {
    title: 'Privacy',
    body: 'We only use your profile, location, and order data to fulfill deliveries, improve ETA accuracy, and personalize restaurant recommendations.',
  },
  {
    title: 'Payments',
    body: 'Saved payment methods are represented through mock data in this build, but the architecture is ready to swap to a secure PCI-compliant payment provider.',
  },
  {
    title: 'Notifications',
    body: 'Push and email preferences are fully user-controlled in Settings, and critical order updates remain visible in the in-app notifications feed.',
  },
  {
    title: 'Reservations',
    body: 'Restaurant booking reminders are opt-in. You can disable reminders for any upcoming reservation from the bookings flow.',
  },
];

export default function LegalScreen() {
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Privacy & Terms"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      {sections.map((section) => (
        <View
          key={section.title}
          style={{
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            gap: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <AppText variant="title">{section.title}</AppText>
          <AppText variant="body" color={theme.colors.textMuted}>
            {section.body}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}
