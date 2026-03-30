import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function TrackOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <EmptyState
        icon="navigate-outline"
        title={`Tracking order ${id ?? ''}`}
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
