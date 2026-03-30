import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';

export default function FavoritesScreen() {
  return (
    <Screen>
      <EmptyState
        icon="heart-outline"
        title="Building favorites"
        description="This route is scaffolded and will be replaced in the next pass."
      />
    </Screen>
  );
}
