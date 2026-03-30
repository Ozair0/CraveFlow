import { router } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { DishCard, RestaurantCard } from '@/components/cards/catalog-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getFavoriteDishes, getFavoriteRestaurants } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function FavoritesScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { appState, toggleFavoriteDish, toggleFavoriteRestaurant } = useAppState();
  const [segment, setSegment] = useState('dishes');
  const gridGap = theme.spacing.md;
  const gridCardWidth = Math.floor((width - theme.spacing.lg * 2 - gridGap) / 2);

  if (!appState) {
    return null;
  }

  const favoriteDishes = getFavoriteDishes(appState);
  const favoriteRestaurants = getFavoriteRestaurants(appState);

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="My Favorites"
        centered
        right={<IconButton name="search-outline" onPress={() => router.push('/(app)/search')} filled={false} />}
      />

      <SegmentedControl
        value={segment}
        onChange={setSegment}
        options={[
          { label: 'Dishes', value: 'dishes' },
          { label: 'Restaurant', value: 'restaurants' },
        ]}
      />

      {segment === 'dishes' ? (
        favoriteDishes.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
            {favoriteDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                cardWidth={gridCardWidth}
                onPress={() =>
                  router.push({ pathname: '/(app)/product/[id]', params: { id: dish.id } })
                }
                isFavorite
                onToggleFavorite={() => toggleFavoriteDish(dish.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="heart-outline"
            title="No favorite dishes yet"
            description="Tap the heart on any dish to save it here for quick reordering."
            actionLabel="Browse Dishes"
            onActionPress={() => router.push('/(app)/(tabs)/explore')}
          />
        )
      ) : favoriteRestaurants.length > 0 ? (
        <View style={{ gap: theme.spacing.md }}>
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() =>
                router.push({
                  pathname: '/(app)/restaurant/[id]',
                  params: { id: restaurant.id },
                })
              }
              isFavorite
              onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="storefront-outline"
          title="No favorite restaurants yet"
          description="Save your go-to spots so dinner plans and table bookings are always close by."
          actionLabel="Browse Restaurants"
          onActionPress={() => router.push('/(app)/(tabs)/explore')}
        />
      )}
    </Screen>
  );
}
