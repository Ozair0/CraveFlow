import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DishCard } from '@/components/cards/catalog-cards';
import { SectionHeader } from '@/components/layout/section-header';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { dishes, restaurants } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDishRating, formatMinutesRange } from '@/lib/format';
import { useAppState } from '@/providers/app-provider';

export default function RestaurantScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState, toggleFavoriteDish, toggleFavoriteRestaurant } = useAppState();
  const restaurant = restaurants.find((entry) => entry.id === id);

  if (!restaurant || !appState) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.lg }}>
          <AppText variant="heading">Restaurant not found</AppText>
          <PrimaryButton
            label="Back to Home"
            fullWidth={false}
            onPress={() => router.replace('/(app)/(tabs)')}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const restaurantDishes = dishes.filter((dish) => dish.restaurantId === restaurant.id);
  const isFavorite = appState.favorites.restaurantIds.includes(restaurant.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image source={restaurant.coverImage} style={{ width: '100%', height: 280 }} />
          <View
            style={{
              position: 'absolute',
              top: theme.spacing.lg,
              left: theme.spacing.lg,
              right: theme.spacing.lg,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <IconButton name="arrow-back" onPress={() => router.back()} />
            <IconButton
              name={isFavorite ? 'heart' : 'heart-outline'}
              color={isFavorite ? theme.colors.primary : theme.colors.text}
              onPress={() => toggleFavoriteRestaurant(restaurant.id)}
            />
          </View>
        </View>

        <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
          <View
            style={{
              marginTop: -42,
              borderRadius: theme.radii.xl,
              backgroundColor: theme.colors.card,
              padding: theme.spacing.lg,
              gap: theme.spacing.md,
              ...theme.shadow.card,
            }}>
            <View style={{ gap: 6 }}>
              <AppText variant="heading">{restaurant.name}</AppText>
              <AppText variant="body" color={theme.colors.textMuted}>
                {restaurant.description}
              </AppText>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
              {[
                {
                  icon: 'star',
                  label: formatDishRating(restaurant.rating, restaurant.reviewCount),
                },
                {
                  icon: 'time-outline',
                  label: formatMinutesRange(restaurant.deliveryTimeMinutes),
                },
                {
                  icon: 'location-outline',
                  label: `${restaurant.distanceMiles.toFixed(1)} miles`,
                },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={item.icon === 'star' ? theme.colors.warning : theme.colors.textSoft}
                  />
                  <AppText variant="caption">{item.label}</AppText>
                </View>
              ))}
            </View>

            <AppText variant="caption" color={theme.colors.textMuted}>
              {restaurant.address}
            </AppText>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {restaurant.bookingAvailable ? (
              <PrimaryButton
                label="Reserve Table"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/reserve/[restaurantId]',
                    params: { restaurantId: restaurant.id },
                  })
                }
              />
            ) : null}
            <PrimaryButton
              label="View Orders"
              variant="outline"
              onPress={() => router.push('/(app)/orders')}
            />
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <SectionHeader title="Popular Menu" actionLabel={`${restaurantDishes.length} items`} />
            <View style={{ gap: theme.spacing.md }}>
              {restaurantDishes.map((dish) => (
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
