import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function SearchScreen() {
  return (
    <Screen>
      <EmptyState
        icon="search-outline"
        title="Building search"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
