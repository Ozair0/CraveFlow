import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function SettingsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="settings-outline"
        title="Building settings"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
