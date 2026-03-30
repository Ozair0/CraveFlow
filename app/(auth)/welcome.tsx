import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function WelcomeScreen() {
  return (
    <Screen>
      <EmptyState
        icon="fast-food-outline"
        title="Building the welcome screen"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
