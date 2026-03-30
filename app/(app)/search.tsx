import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { DishCard, RestaurantCard } from '@/components/cards/catalog-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { categories } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { searchDishes, searchRestaurants } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function SearchScreen() {
  const theme = useAppTheme();
  const { appState, toggleFavoriteDish, toggleFavoriteRestaurant } = useAppState();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const initialQuery = typeof params.q === 'string' ? params.q : '';
  const initialCategory = typeof params.category === 'string' ? params.category : 'all';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialCategory, initialQuery]);

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

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Search"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <SearchBar value={query} onChangeText={setQuery} placeholder="Search food, cuisines, restaurants..." />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: theme.spacing.sm, alignItems: 'center' }}>
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

      {dishResults.length === 0 && restaurantResults.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No matching results"
          description="Try another keyword or browse the popular categories above."
          actionLabel="Back to Explore"
          onActionPress={() => router.replace('/(app)/(tabs)/explore')}
        />
      ) : (
        <View style={{ gap: theme.spacing.xl }}>
          <View style={{ gap: theme.spacing.md }}>
            {dishResults.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                variant="wide"
                onPress={() =>
                  router.push({ pathname: '/(app)/product/[id]', params: { id: dish.id } })
                }
                onToggleFavorite={() => toggleFavoriteDish(dish.id)}
                isFavorite={appState.favorites.dishIds.includes(dish.id)}
              />
            ))}
          </View>

          <View style={{ gap: theme.spacing.md }}>
            {restaurantResults.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() =>
                  router.push({ pathname: '/(app)/restaurant/[id]', params: { id: restaurant.id } })
                }
                onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
                isFavorite={appState.favorites.restaurantIds.includes(restaurant.id)}
              />
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}
