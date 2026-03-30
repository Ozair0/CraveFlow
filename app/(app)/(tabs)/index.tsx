import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DishCard, OfferBanner, RestaurantCard } from '@/components/cards/catalog-cards';
import { Screen } from '@/components/layout/screen';
import { SectionHeader } from '@/components/layout/section-header';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { categories, dishes, offers, restaurants } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function HomeScreen() {
  const theme = useAppTheme();
  const { appState, toggleFavoriteDish, toggleFavoriteRestaurant } = useAppState();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const favoriteDishIds = appState?.favorites.dishIds ?? [];
  const favoriteRestaurantIds = appState?.favorites.restaurantIds ?? [];

  const filteredPopular = useMemo(
    () =>
      dishes.filter((dish) => {
        const queryMatches =
          query.trim().length === 0 ||
          dish.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          dish.cuisine.toLowerCase().includes(query.trim().toLowerCase());
        const categoryMatches =
          selectedCategory === 'all' || dish.categoryIds.includes(selectedCategory);
        return dish.isPopular && queryMatches && categoryMatches;
      }),
    [query, selectedCategory]
  );

  const nearbyRestaurants = useMemo(
    () =>
      restaurants.filter((restaurant) =>
        selectedCategory === 'all'
          ? true
          : dishes.some(
              (dish) =>
                dish.restaurantId === restaurant.id && dish.categoryIds.includes(selectedCategory)
            )
      ),
    [selectedCategory]
  );

  if (!appState) {
    return null;
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        <Image
          source={appState.session.user.avatar}
          style={{ width: 48, height: 48, borderRadius: 24 }}
          contentFit="cover"
        />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Location
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <AppText variant="label">{appState.session.user.locationLabel}</AppText>
          </View>
        </View>
        <IconButton name="notifications-outline" onPress={() => router.push('/(app)/notifications')} />
      </View>

      <SearchBar value={query} onChangeText={setQuery} onFilterPress={() => router.push('/(app)/search')} />

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Exclusive Offers" actionLabel="See All" onActionPress={() => router.push('/(app)/coupons')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: theme.spacing.md,
            paddingHorizontal: 2,
            paddingVertical: 8,
          }}>
          {offers.map((offer) => (
            <OfferBanner key={offer.id} offer={offer} onPress={() => router.push('/(app)/coupons')} />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Explore Categories" actionLabel="See All" onActionPress={() => router.push('/(app)/search')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
          <Chip label="All" selected={selectedCategory === 'all'} onPress={() => setSelectedCategory('all')} />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.label}
              icon={category.icon as keyof typeof Ionicons.glyphMap}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Popular Dishes" actionLabel="See All" onActionPress={() => router.push('/(app)/search')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: theme.spacing.md,
            paddingHorizontal: 2,
            paddingVertical: 8,
          }}>
          {filteredPopular.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onPress={() => router.push(`/(app)/product/${dish.id}`)}
              onToggleFavorite={() => toggleFavoriteDish(dish.id)}
              isFavorite={favoriteDishIds.includes(dish.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Nearby Restaurants" actionLabel="See All" onActionPress={() => router.push('/(app)/search')} />
        <View style={{ gap: theme.spacing.md }}>
          {nearbyRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => router.push(`/(app)/restaurant/${restaurant.id}`)}
              isFavorite={favoriteRestaurantIds.includes(restaurant.id)}
              onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/(app)/bookings')}
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.cardMuted,
          padding: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
          }}>
          <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="label">Plan a dinner booking</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Reserve a table at featured restaurants in a couple taps.
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textSoft} />
      </Pressable>
    </Screen>
  );
}
