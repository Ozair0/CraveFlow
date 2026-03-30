import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <EmptyState
        icon="key-outline"
        title="Building password reset"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
