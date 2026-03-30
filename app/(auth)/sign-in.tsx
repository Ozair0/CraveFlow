import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function SignInScreen() {
  return (
    <Screen>
      <EmptyState
        icon="log-in-outline"
        title="Building sign in"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
