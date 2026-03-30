import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function NotificationsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="notifications-outline"
        title="Building notifications"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
