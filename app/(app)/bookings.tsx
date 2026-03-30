import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BookingCard } from '@/components/cards/service-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getBookingGroups } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function BookingsScreen() {
  const theme = useAppTheme();
  const { appState, cancelBooking, toggleBookingReminder } = useAppState();
  const [status, setStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  if (!appState) {
    return null;
  }

  const bookings = getBookingGroups(appState, status);

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="My Booking"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <SegmentedControl
        value={status}
        onChange={(value) => setStatus(value as typeof status)}
        options={[
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title={`No ${status} bookings`}
          description="Reserve a table from restaurant pages and your visits will appear here."
          actionLabel="Explore Restaurants"
          onActionPress={() => router.replace('/(app)/(tabs)/explore')}
        />
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              primaryLabel={status === 'upcoming' ? 'Navigate' : 'View Restaurant'}
              secondaryLabel={status === 'upcoming' ? 'Cancel' : undefined}
              onPrimaryPress={() =>
                router.push({
                  pathname: '/(app)/restaurant/[id]',
                  params: { id: booking.restaurantId },
                })
              }
              onSecondaryPress={status === 'upcoming' ? () => cancelBooking(booking.id) : undefined}
              onToggleReminder={status === 'upcoming' ? () => toggleBookingReminder(booking.id) : undefined}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
