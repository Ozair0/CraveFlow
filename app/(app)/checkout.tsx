import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function CheckoutScreen() {
  return (
    <Screen>
      <EmptyState
        icon="card-outline"
        title="Building checkout"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
