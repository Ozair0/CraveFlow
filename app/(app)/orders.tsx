import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function OrdersScreen() {
  return (
    <Screen>
      <EmptyState
        icon="receipt-outline"
        title="Building orders"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
