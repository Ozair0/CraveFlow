import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function ProfileScreen() {
  return (
    <Screen>
      <EmptyState
        icon="person-outline"
        title="Building profile"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
