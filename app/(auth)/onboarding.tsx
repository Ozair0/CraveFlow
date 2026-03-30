import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function OnboardingScreen() {
  return (
    <Screen>
      <EmptyState
        icon="sparkles-outline"
        title="Building the onboarding experience"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
