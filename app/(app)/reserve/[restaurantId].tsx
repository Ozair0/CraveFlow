import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function ReserveScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  return (
    <Screen>
      <EmptyState
        icon="calendar-outline"
        title={`Booking ${restaurantId ?? ''}`}
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
