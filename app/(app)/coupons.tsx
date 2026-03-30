import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function CouponsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="pricetags-outline"
        title="Building coupons"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
