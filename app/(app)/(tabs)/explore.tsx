import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function ExploreScreen() {
  return (
    <Screen>
      <EmptyState
        icon="compass-outline"
        title="Building explore"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
