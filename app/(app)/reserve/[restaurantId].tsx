import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { restaurants } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

const dateOptions = ['Apr 15', 'Apr 16', 'Apr 17', 'Apr 18'];
const timeOptions = ['06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'];

export default function ReserveScreen() {
  const theme = useAppTheme();
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { createBooking } = useAppState();
  const restaurant = restaurants.find((entry) => entry.id === restaurantId);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[2]);
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingLabel = useMemo(
    () => `${selectedDate}, 2026 · ${selectedTime}`,
    [selectedDate, selectedTime]
  );

  if (!restaurant) {
    return (
      <Screen>
        <AppText variant="heading">Restaurant not found</AppText>
      </Screen>
    );
  }

  const handleReserve = async () => {
    setIsSubmitting(true);
    await createBooking({
      restaurantId: restaurant.id,
      bookingDateLabel: bookingLabel,
      guests,
    });
    setIsSubmitting(false);
    Alert.alert('Table booked', 'Your reservation has been added to My Booking.');
    router.replace('/(app)/bookings');
  };

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Reserve Table"
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
        <AppText variant="heading">{restaurant.name}</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          {restaurant.address}
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="title">Choose Date</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
          {dateOptions.map((dateOption) => (
            <Chip
              key={dateOption}
              label={dateOption}
              selected={selectedDate === dateOption}
              onPress={() => setSelectedDate(dateOption)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="title">Choose Time</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {timeOptions.map((timeOption) => (
            <Chip
              key={timeOption}
              label={timeOption}
              selected={selectedTime === timeOption}
              onPress={() => setSelectedTime(timeOption)}
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
        <AppText variant="title">Guest Count</AppText>
        <QuantityStepper
          value={guests}
          onDecrease={() => setGuests((current) => Math.max(1, current - 1))}
          onIncrease={() => setGuests((current) => current + 1)}
        />
        <AppText variant="caption" color={theme.colors.textMuted}>
          We&apos;ll share this with the restaurant so they can prepare your table in advance.
        </AppText>
      </View>

      <PrimaryButton label="Confirm Booking" onPress={handleReserve} loading={isSubmitting} />
    </Screen>
  );
}
