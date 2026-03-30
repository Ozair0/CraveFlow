import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function AddressesScreen() {
  return (
    <Screen>
      <EmptyState
        icon="location-outline"
        title="Building addresses"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
