import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function BookingsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="calendar-number-outline"
        title="Building bookings"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
