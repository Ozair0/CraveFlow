import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function PaymentMethodsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="card-outline"
        title="Building payment methods"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
