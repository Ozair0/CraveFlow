import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function CartScreen() {
  return (
    <Screen>
      <EmptyState
        icon="bag-handle-outline"
        title="Building cart"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
