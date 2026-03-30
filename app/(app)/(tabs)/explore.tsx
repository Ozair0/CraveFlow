import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { DishCard, RestaurantCard } from '@/components/cards/catalog-cards';
import { Screen } from '@/components/layout/screen';
import { SectionHeader } from '@/components/layout/section-header';
import { EmptyState } from '@/components/states/empty-state';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { SearchBar } from '@/components/ui/search-bar';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { categories } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { searchDishes, searchRestaurants } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function ExploreScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { appState, toggleFavoriteDish, toggleFavoriteRestaurant } = useAppState();
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const deferredQuery = useDeferredValue(query);

  const dishResults = useMemo(
    () => searchDishes(deferredQuery, selectedCategory),
    [deferredQuery, selectedCategory]
  );
  const restaurantResults = useMemo(
    () => searchRestaurants(deferredQuery, selectedCategory),
    [deferredQuery, selectedCategory]
  );

  if (!appState) {
    return null;
  }

  const showDishes = segment === 'all' || segment === 'dishes';
  const showRestaurants = segment === 'all' || segment === 'restaurants';
  const noResults =
    (showDishes ? dishResults.length === 0 : true) &&
    (showRestaurants ? restaurantResults.length === 0 : true);
  const gridGap = theme.spacing.md;
  const gridCardWidth = Math.floor((width - theme.spacing.lg * 2 - gridGap) / 2);

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <View style={{ gap: 8 }}>
        <AppText variant="display">Explore</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Search for dishes, discover cuisines, and browse the best nearby spots.
        </AppText>
      </View>

      <SearchBar value={query} onChangeText={setQuery} onFilterPress={() => router.push('/(app)/search')} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
        <Chip label="All" selected={selectedCategory === 'all'} onPress={() => startTransition(() => setSelectedCategory('all'))} />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            icon={category.icon as keyof typeof Ionicons.glyphMap}
            selected={selectedCategory === category.id}
            onPress={() => startTransition(() => setSelectedCategory(category.id))}
          />
        ))}
      </ScrollView>

      <SegmentedControl
        value={segment}
        onChange={setSegment}
        options={[
          { value: 'all', label: 'All' },
          { value: 'dishes', label: 'Dishes' },
          { value: 'restaurants', label: 'Restaurants' },
        ]}
      />

      {noResults ? (
        <EmptyState
          icon="search-outline"
          title="No results found"
          description="Try a shorter search or switch categories to explore more food nearby."
          actionLabel="Clear Search"
          onActionPress={() => {
            setQuery('');
            setSelectedCategory('all');
            setSegment('all');
          }}
        />
      ) : (
        <View style={{ gap: theme.spacing.xl }}>
          {showDishes ? (
            <View style={{ gap: theme.spacing.md }}>
              <SectionHeader title="Top Dishes" actionLabel={`${dishResults.length} items`} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
                {dishResults.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    cardWidth={gridCardWidth}
                    onPress={() =>
                      router.push({ pathname: '/(app)/product/[id]', params: { id: dish.id } })
                    }
                    onToggleFavorite={() => toggleFavoriteDish(dish.id)}
                    isFavorite={appState.favorites.dishIds.includes(dish.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {showRestaurants ? (
            <View style={{ gap: theme.spacing.md }}>
              <SectionHeader title="Nearby Restaurants" actionLabel={`${restaurantResults.length} spots`} />
              <View style={{ gap: theme.spacing.md }}>
                {restaurantResults.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onPress={() =>
                      router.push({
                        pathname: '/(app)/restaurant/[id]',
                        params: { id: restaurant.id },
                      })
                    }
                    isFavorite={appState.favorites.restaurantIds.includes(restaurant.id)}
                    onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
