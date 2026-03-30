import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, maskCardNumber } from '@/lib/format';
import { getCartSummary } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function CheckoutScreen() {
  const theme = useAppTheme();
  const { appState, checkout } = useAppState();
  const [selectedAddressId, setSelectedAddressId] = useState(appState?.addresses[0]?.id ?? '');
  const [selectedPaymentId, setSelectedPaymentId] = useState(appState?.paymentMethods[0]?.id ?? '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appState) {
    return null;
  }

  const summary = getCartSummary(appState);

  if (summary.lineItems.length === 0) {
    return (
      <Screen>
        <PageHeader
          title="Checkout"
          centered
          left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
        />
        <EmptyState
          icon="bag-handle-outline"
          title="No items to checkout"
          description="Your cart is empty right now. Add a meal to place an order."
          actionLabel="Go to Cart"
          onActionPress={() => router.replace('/(app)/(tabs)/cart')}
        />
      </Screen>
    );
  }

  const handleCheckout = async () => {
    setIsSubmitting(true);
    const orderId = await checkout({
      addressId: selectedAddressId,
      paymentMethodId: selectedPaymentId,
    });
    setIsSubmitting(false);
    Alert.alert('Order placed', 'Your meal is on the way.');
    router.replace({ pathname: '/(app)/track-order/[id]', params: { id: orderId } });
  };

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Checkout"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="title">Choose Address</AppText>
        {appState.addresses.map((address) => {
          const selected = address.id === selectedAddressId;
          return (
            <Pressable
              key={address.id}
              onPress={() => setSelectedAddressId(address.id)}
              style={{
                borderRadius: theme.radii.lg,
                padding: theme.spacing.md,
                backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.card,
                borderWidth: 1,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
              }}>
              <AppText variant="label">{address.label}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {address.line1}, {address.city}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="title">Choose Payment</AppText>
        {appState.paymentMethods.map((method) => {
          const selected = method.id === selectedPaymentId;
          return (
            <Pressable
              key={method.id}
              onPress={() => setSelectedPaymentId(method.id)}
              style={{
                borderRadius: theme.radii.lg,
                padding: theme.spacing.md,
                backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.card,
                borderWidth: 1,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
              }}>
              <AppText variant="label">{method.label}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {method.brand === 'Apple Pay'
                  ? 'Apple Pay'
                  : `${method.brand} ${maskCardNumber(method.last4)}`}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 8 }}>
        <AppText variant="title">Delivery Notes</AppText>
        <View
          style={{
            minHeight: 110,
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.md,
          }}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Gate code, napkins, or handoff preferences..."
            placeholderTextColor={theme.colors.textSoft}
            style={{
              minHeight: 80,
              color: theme.colors.text,
              fontFamily: 'Urbanist_500Medium',
              fontSize: theme.typography.body,
              textAlignVertical: 'top',
            }}
          />
        </View>
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
        <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.sm }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="title">Total</AppText>
          <AppText variant="title">{formatCurrency(summary.total)}</AppText>
        </View>
      </View>

      <PrimaryButton label="Place Order" onPress={handleCheckout} loading={isSubmitting} />
    </Screen>
  );
}
