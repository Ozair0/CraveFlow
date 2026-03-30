import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function HomeScreen() {
  return (
    <Screen>
      <EmptyState
        icon="home-outline"
        title="Building the home experience"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
