import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';

const faqs = [
  {
    title: 'How do I track a live order?',
    body: 'Open My Orders, choose an active order, and tap Track Order to view the live route and ETA.',
  },
  {
    title: 'How do bookings work?',
    body: 'Available restaurants offer instant reservations. Upcoming bookings appear in My Bookings where you can manage reminders.',
  },
  {
    title: 'What happens if my payment fails?',
    body: 'CraveFlow keeps your cart intact, shows the failure state, and lets you retry with another saved payment method.',
  },
];

export default function HelpScreen() {
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Help Center"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
          ...theme.shadow.card,
        }}>
        <AppText variant="title">We are here when your order needs backup</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Reach support for delivery issues, reservation changes, payment questions, or app help.
        </AppText>
        <PrimaryButton
          label="Email Support"
          onPress={() => Linking.openURL('mailto:support@craveflow.app')}
          fullWidth={false}
          style={{ marginTop: theme.spacing.sm }}
        />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        {faqs.map((item) => (
          <View
            key={item.title}
            style={{
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.card,
              padding: theme.spacing.lg,
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
            <AppText variant="label">{item.title}</AppText>
            <AppText variant="body" color={theme.colors.textMuted}>
              {item.body}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}
