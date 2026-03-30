import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { formatCurrency, maskCardNumber } from '@/lib/format';
import { getCartSummary } from '@/lib/selectors';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function CartScreen() {
  const theme = useAppTheme();
  const {
    appState,
    updateCartQuantity,
    removeCartItem,
    applyCoupon,
    clearCoupon,
  } = useAppState();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  if (!appState) {
    return null;
  }

  const summary = getCartSummary(appState);
  const defaultAddress = appState.addresses.find((address) => address.isDefault) ?? appState.addresses[0];
  const defaultPayment =
    appState.paymentMethods.find((method) => method.isDefault) ?? appState.paymentMethods[0];

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    if (!result.ok) {
      setCouponMessage(result.message);
      return;
    }

    setCouponMessage('Coupon applied successfully.');
    setCouponCode('');
  };

  if (summary.lineItems.length === 0) {
    return (
      <Screen>
        <PageHeader title="My Cart" centered />
        <EmptyState
          icon="bag-handle-outline"
          title="Your cart is empty"
          description="Add a few dishes to start your order and unlock coupon savings."
          actionLabel="Explore Dishes"
          onActionPress={() => router.push('/(app)/(tabs)/explore')}
        />
      </Screen>
    );
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader title="My Cart" centered />

      <View style={{ gap: theme.spacing.md }}>
        {summary.lineItems.map((lineItem) => (
          <View
            key={lineItem.item.id}
            style={{
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.card,
              padding: theme.spacing.md,
              gap: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <Image
                source={lineItem.dish.image}
                style={{ width: 92, height: 92, borderRadius: 18 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="label">{lineItem.dish.name}</AppText>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      {lineItem.restaurant.name}
                    </AppText>
                  </View>
                  <IconButton
                    name="close-outline"
                    size={18}
                    filled={false}
                    onPress={() => removeCartItem(lineItem.item.id)}
                  />
                </View>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {lineItem.size.label} ·{' '}
                  {lineItem.addOns.length > 0
                    ? lineItem.addOns.map((addOn) => addOn.label).join(', ')
                    : 'No extras'}
                </AppText>
                <AppText variant="label">{formatCurrency(lineItem.lineTotal)}</AppText>
              </View>
            </View>
            <QuantityStepper
              value={lineItem.item.quantity}
              onDecrease={() =>
                updateCartQuantity(lineItem.item.id, Math.max(lineItem.item.quantity - 1, 0))
              }
              onIncrease={() => updateCartQuantity(lineItem.item.id, lineItem.item.quantity + 1)}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          gap: theme.spacing.md,
        }}>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <View
            style={{
              flex: 1,
              minHeight: 54,
              borderRadius: theme.radii.pill,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: theme.spacing.md,
              justifyContent: 'center',
              backgroundColor: theme.colors.surface,
            }}>
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter coupon code"
              placeholderTextColor={theme.colors.textSoft}
              style={{
                color: theme.colors.text,
                fontFamily: 'Urbanist_500Medium',
                fontSize: theme.typography.body,
              }}
            />
          </View>
          <PrimaryButton label="Apply" onPress={handleApplyCoupon} fullWidth={false} />
        </View>

        {summary.appliedCoupon ? (
          <Pressable
            onPress={clearCoupon}
            style={{
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primaryMuted,
              padding: theme.spacing.md,
            }}>
            <AppText variant="caption" color={theme.colors.primary}>
              Applied: {summary.appliedCoupon.code}. Tap to remove.
            </AppText>
          </Pressable>
        ) : null}

        {couponMessage ? (
          <AppText
            variant="caption"
            color={couponMessage.includes('successfully') ? theme.colors.success : theme.colors.danger}>
            {couponMessage}
          </AppText>
        ) : null}
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <Pressable
          onPress={() => router.push('/(app)/addresses')}
          style={{
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Delivery Address
          </AppText>
          <AppText variant="label" style={{ marginTop: 6 }}>
            {defaultAddress?.label}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {defaultAddress?.line1}, {defaultAddress?.city}
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(app)/payment-methods')}
          style={{
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Payment Method
          </AppText>
          <AppText variant="label" style={{ marginTop: 6 }}>
            {defaultPayment?.label}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {defaultPayment?.brand === 'Apple Pay'
              ? 'Apple Pay'
              : `${defaultPayment?.brand} ${maskCardNumber(defaultPayment?.last4 ?? '0000')}`}
          </AppText>
        </Pressable>
      </View>

      <View
        style={{
          borderRadius: theme.radii.xl,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="body" color={theme.colors.textMuted}>
            Subtotal
          </AppText>
          <AppText variant="label">{formatCurrency(summary.subtotal)}</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="body" color={theme.colors.textMuted}>
            Delivery Fee
          </AppText>
          <AppText variant="label">{formatCurrency(summary.deliveryFee)}</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="body" color={theme.colors.textMuted}>
            Service Fee
          </AppText>
          <AppText variant="label">{formatCurrency(summary.serviceFee)}</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="body" color={theme.colors.textMuted}>
            Discount
          </AppText>
          <AppText variant="label" color={theme.colors.success}>
            -{formatCurrency(summary.discount)}
          </AppText>
        </View>
        <View
          style={{
            marginVertical: theme.spacing.sm,
            height: 1,
            backgroundColor: theme.colors.border,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="title">Total</AppText>
          <AppText variant="title">{formatCurrency(summary.total)}</AppText>
        </View>
      </View>

      <PrimaryButton label="Continue to Checkout" onPress={() => router.push('/(app)/checkout')} />
    </Screen>
  );
}
