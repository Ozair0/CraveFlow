import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { dishes, getRestaurantById } from '@/data/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDishRating } from '@/lib/format';
import { useAppState } from '@/providers/app-provider';

export default function ProductScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState, addToCart, toggleFavoriteDish } = useAppState();
  const dish = dishes.find((entry) => entry.id === id);
  const restaurant = dish ? getRestaurantById(dish.restaurantId) : undefined;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState(dish?.sizes[0]?.id ?? '');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const selectedSize = useMemo(
    () => dish?.sizes.find((size) => size.id === selectedSizeId),
    [dish?.sizes, selectedSizeId]
  );

  const total = useMemo(() => {
    if (!dish || !selectedSize) {
      return 0;
    }

    const addOnTotal = dish.addOns
      .filter((addOn) => selectedAddOnIds.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.price, 0);

    return (selectedSize.price + addOnTotal) * quantity;
  }, [dish, quantity, selectedAddOnIds, selectedSize]);

  if (!dish || !restaurant || !appState) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.lg }}>
          <AppText variant="heading">Item not found</AppText>
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

  const isFavorite = appState.favorites.dishIds.includes(dish.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}>
        <View>
          <Image
            source={dish.gallery[selectedImage] ?? dish.image}
            style={{ width: '100%', height: 330 }}
            contentFit="cover"
          />
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
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <IconButton
                name={isFavorite ? 'heart' : 'heart-outline'}
                color={isFavorite ? theme.colors.primary : theme.colors.text}
                onPress={() => toggleFavoriteDish(dish.id)}
              />
              <IconButton name="share-social-outline" onPress={() => undefined} />
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: theme.spacing.lg,
              left: theme.spacing.lg,
              right: theme.spacing.lg,
              flexDirection: 'row',
              gap: theme.spacing.sm,
            }}>
            {dish.gallery.map((galleryItem, index) => (
              <Pressable key={galleryItem} onPress={() => setSelectedImage(index)}>
                <Image
                  source={galleryItem}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: index === selectedImage ? '#FFFFFF' : 'transparent',
                  }}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 6 }}>
              {dish.offerLabel ? (
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(58, 182, 107, 0.15)',
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}>
                  <AppText variant="caption" color={theme.colors.success}>
                    {dish.offerLabel}
                  </AppText>
                </View>
              ) : null}
              <AppText variant="heading">{dish.name}</AppText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <AppText variant="label">{formatDishRating(dish.rating, dish.reviewCount)}</AppText>
            </View>
          </View>

          <Pressable
            onPress={() =>
              router.push({ pathname: '/(app)/restaurant/[id]', params: { id: restaurant.id } })
            }
            style={{
              flexDirection: 'row',
              gap: theme.spacing.md,
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.card,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
            <Image source={restaurant.image} style={{ width: 82, height: 82, borderRadius: 18 }} />
            <View style={{ flex: 1, gap: 6 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: theme.colors.primaryMuted,
                }}>
                <AppText variant="caption" color={theme.colors.primary}>
                  {restaurant.deliveryFeeLabel}
                </AppText>
              </View>
              <AppText variant="label">{restaurant.name}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {restaurant.address}
              </AppText>
            </View>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            {[
              { icon: 'time-outline', label: 'Cooking Time', value: `${dish.cookTimeMinutes} min` },
              { icon: 'restaurant-outline', label: 'Cuisine', value: dish.cuisine },
              { icon: 'flame-outline', label: 'Calories', value: `${dish.calories} kcal` },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  borderRadius: theme.radii.lg,
                  backgroundColor: theme.colors.card,
                  padding: theme.spacing.md,
                  gap: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={theme.colors.primary} />
                <AppText variant="caption" color={theme.colors.textSoft}>
                  {item.label}
                </AppText>
                <AppText variant="label">{item.value}</AppText>
              </View>
            ))}
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="title">About this dish</AppText>
            <AppText variant="body" color={theme.colors.textMuted}>
              {dish.description}
            </AppText>
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <AppText variant="title">Select Size</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
              {dish.sizes.map((size) => (
                <Pressable
                  key={size.id}
                  onPress={() => setSelectedSizeId(size.id)}
                  style={{
                    width: 112,
                    borderRadius: theme.radii.lg,
                    padding: theme.spacing.md,
                    borderWidth: 1,
                    borderColor:
                      selectedSizeId === size.id ? theme.colors.primary : theme.colors.border,
                    backgroundColor:
                      selectedSizeId === size.id ? theme.colors.primaryMuted : theme.colors.card,
                    gap: 6,
                  }}>
                  <AppText
                    variant="caption"
                    color={selectedSizeId === size.id ? theme.colors.primary : theme.colors.textMuted}>
                    {size.label}
                  </AppText>
                  <AppText variant="label">{size.inches > 0 ? `${size.inches}"` : size.label}</AppText>
                  <AppText variant="label">{formatCurrency(size.price)}</AppText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <AppText variant="title">Choose Toppings</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {dish.addOns.map((addOn) => (
                <Chip
                  key={addOn.id}
                  label={`${addOn.label} · ${formatCurrency(addOn.price)}`}
                  selected={selectedAddOnIds.includes(addOn.id)}
                  onPress={() =>
                    setSelectedAddOnIds((current) =>
                      current.includes(addOn.id)
                        ? current.filter((entry) => entry !== addOn.id)
                        : [...current, addOn.id]
                    )
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        style={{
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <QuantityStepper
            value={quantity}
            onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
            onIncrease={() => setQuantity((current) => current + 1)}
          />
          <PrimaryButton
            label={`Add item ${formatCurrency(total)}`}
            onPress={() => {
              addToCart({
                dishId: dish.id,
                sizeId: selectedSizeId,
                quantity,
                addOnIds: selectedAddOnIds,
              });
              router.push('/(app)/(tabs)/cart');
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
