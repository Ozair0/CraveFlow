import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function SignUpScreen() {
  return (
    <Screen>
      <EmptyState
        icon="person-add-outline"
        title="Building sign up"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
