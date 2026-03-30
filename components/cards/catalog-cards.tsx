import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { getRestaurantById } from '@/data/mock-data';
import { formatCurrency, formatDishRating, formatMinutesRange } from '@/lib/format';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Dish, Offer, Restaurant } from '@/types/app';

import { AppText } from '../ui/app-text';
import { IconButton } from '../ui/icon-button';
import { PrimaryButton } from '../ui/primary-button';

export function OfferBanner({
  offer,
  onPress,
}: {
  offer: Offer;
  onPress?: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable onPress={onPress} style={{ width: 290 }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={{
          borderRadius: theme.radii.xl,
          overflow: 'hidden',
          minHeight: 170,
          padding: theme.spacing.lg,
          justifyContent: 'space-between',
        }}>
        <View style={{ maxWidth: '55%' }}>
          <AppText variant="caption" color="#FFE2D4">
            {offer.title}
          </AppText>
          <AppText variant="title" color="#FFFFFF" style={{ marginTop: 6 }}>
            {offer.subtitle}
          </AppText>
          <PrimaryButton
            label={offer.ctaLabel}
            fullWidth={false}
            variant="ghost"
            style={{
              marginTop: theme.spacing.md,
              backgroundColor: 'rgba(255,255,255,0.16)',
              paddingHorizontal: theme.spacing.lg,
            }}
          />
        </View>
        <Image
          source={offer.image}
          style={{
            position: 'absolute',
            right: -18,
            bottom: -8,
            width: 170,
            height: 170,
            borderRadius: 85,
          }}
          contentFit="cover"
        />
      </LinearGradient>
    </Pressable>
  );
}

type DishCardProps = {
  dish: Dish;
  onPress: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: 'grid' | 'wide';
  footerAction?: React.ReactNode;
};

export function DishCard({
  dish,
  onPress,
  onToggleFavorite,
  isFavorite,
  variant = 'grid',
  footerAction,
}: DishCardProps) {
  const theme = useAppTheme();
  const restaurant = getRestaurantById(dish.restaurantId);
  const startingPrice = dish.sizes[0]?.price ?? 0;
  const wide = variant === 'wide';

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: wide ? '100%' : 164,
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadow.soft,
      }}>
      <View>
        <Image
          source={dish.image}
          style={{
            width: '100%',
            height: wide ? 132 : 118,
          }}
          contentFit="cover"
        />
        {dish.offerLabel ? (
          <View
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              backgroundColor: 'rgba(58, 182, 107, 0.96)',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
            <AppText variant="caption" color="#FFFFFF">
              {dish.offerLabel}
            </AppText>
          </View>
        ) : null}
        {onToggleFavorite ? (
          <IconButton
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? theme.colors.primary : theme.colors.text}
            onPress={onToggleFavorite}
            style={{ position: 'absolute', right: 10, top: 10 }}
          />
        ) : null}
      </View>

      <View style={{ padding: theme.spacing.md, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="label" style={{ flex: 1 }} numberOfLines={1}>
            {dish.name}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <AppText variant="caption">{dish.rating.toFixed(1)}</AppText>
          </View>
        </View>
        <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={wide ? 2 : 1}>
          {restaurant?.name ?? 'Restaurant'}
        </AppText>
        {wide ? (
          <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={2}>
            {dish.shortDescription}
          </AppText>
        ) : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="label">{formatCurrency(startingPrice)}</AppText>
          {footerAction ?? (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.primary,
              }}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function RestaurantCard({
  restaurant,
  onPress,
  isFavorite,
  onToggleFavorite,
}: {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadow.soft,
      }}>
      <Image source={restaurant.image} style={{ width: 112, height: 118 }} contentFit="cover" />
      <View style={{ flex: 1, padding: theme.spacing.md, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <AppText variant="label" numberOfLines={1}>
              {restaurant.name}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {restaurant.cuisine}
            </AppText>
          </View>
          {onToggleFavorite ? (
            <IconButton
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? theme.colors.primary : theme.colors.text}
              onPress={onToggleFavorite}
            />
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={14} color={theme.colors.warning} />
          <AppText variant="caption">
            {formatDishRating(restaurant.rating, restaurant.reviewCount)}
          </AppText>
        </View>
        <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
          {restaurant.address}
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textSoft} />
            <AppText variant="caption" color={theme.colors.textMuted}>
              {formatMinutesRange(restaurant.deliveryTimeMinutes)}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="bicycle-outline" size={14} color={theme.colors.textSoft} />
            <AppText variant="caption" color={theme.colors.textMuted}>
              {restaurant.deliveryFeeLabel}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
