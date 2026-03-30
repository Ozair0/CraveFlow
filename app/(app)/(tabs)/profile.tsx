import { router } from 'expo-router';
import { View } from 'react-native';

import { MenuRow, ProfileHeader } from '@/components/cards/profile-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function ProfileScreen() {
  const theme = useAppTheme();
  const { appState, signOut } = useAppState();

  if (!appState) {
    return null;
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Profile"
        centered
        right={<IconButton name="settings-outline" onPress={() => router.push('/(app)/settings')} filled={false} />}
      />

      <ProfileHeader user={appState.session.user} />

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.primary,
          padding: theme.spacing.lg,
        }}>
        <AppText variant="caption" color="#FFE7DC">
          CraveFlow Plus
        </AppText>
        <AppText variant="title" color="#FFFFFF" style={{ marginTop: 6 }}>
          Free delivery on eligible orders
        </AppText>
        <AppText variant="caption" color="#FFE7DC" style={{ marginTop: 8 }}>
          Your current tier includes priority support and weekly coupon drops.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <MenuRow
          title="Edit Profile"
          subtitle="Update your personal details"
          icon="create-outline"
          onPress={() => router.push('/(app)/profile-edit')}
        />
        <MenuRow
          title="My Orders"
          subtitle="Track active and past orders"
          icon="receipt-outline"
          onPress={() => router.push('/(app)/orders')}
        />
        <MenuRow
          title="My Bookings"
          subtitle="Manage upcoming restaurant reservations"
          icon="calendar-outline"
          onPress={() => router.push('/(app)/bookings')}
        />
        <MenuRow
          title="Coupons"
          subtitle="Unlock your current savings"
          icon="pricetags-outline"
          onPress={() => router.push('/(app)/coupons')}
        />
        <MenuRow
          title="Saved Addresses"
          subtitle="Choose where deliveries should arrive"
          icon="location-outline"
          onPress={() => router.push('/(app)/addresses')}
        />
        <MenuRow
          title="Payment Methods"
          subtitle="Manage cards and wallet options"
          icon="card-outline"
          onPress={() => router.push('/(app)/payment-methods')}
        />
      </View>

      <PrimaryButton
        label="Sign Out"
        variant="outline"
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        }}
      />
    </Screen>
  );
}
