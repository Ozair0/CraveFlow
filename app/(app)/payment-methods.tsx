import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppTextField } from '@/components/forms/app-text-field';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { maskCardNumber } from '@/lib/format';
import { useAppState } from '@/providers/app-provider';

export default function PaymentMethodsScreen() {
  const theme = useAppTheme();
  const { appState, addPaymentMethod } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [brand, setBrand] = useState<'Visa' | 'Mastercard'>('Visa');
  const [last4, setLast4] = useState('');

  if (!appState) {
    return null;
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Payment Methods"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
        right={<IconButton name="add" onPress={() => setShowForm((current) => !current)} filled={false} />}
      />

      <View style={{ gap: theme.spacing.md }}>
        {appState.paymentMethods.map((method) => (
          <View
            key={method.id}
            style={{
              borderRadius: theme.radii.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.card,
              borderWidth: 1,
              borderColor: method.isDefault ? theme.colors.primary : theme.colors.border,
            }}>
            <AppText variant="label">{method.label}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {method.brand === 'Apple Pay'
                ? 'Apple Pay'
                : `${method.brand} ${maskCardNumber(method.last4)}`}
            </AppText>
          </View>
        ))}
      </View>

      {showForm ? (
        <View
          style={{
            borderRadius: theme.radii.xl,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            gap: theme.spacing.md,
          }}>
          <AppText variant="title">Add New Card</AppText>
          <AppTextField label="Label" placeholder="Personal card" value={label} onChangeText={setLabel} icon="card-outline" />
          <View style={{ gap: theme.spacing.sm }}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Card Brand
            </AppText>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Chip label="Visa" selected={brand === 'Visa'} onPress={() => setBrand('Visa')} />
              <Chip
                label="Mastercard"
                selected={brand === 'Mastercard'}
                onPress={() => setBrand('Mastercard')}
              />
            </View>
          </View>
          <AppTextField
            label="Last 4 Digits"
            placeholder="4242"
            value={last4}
            onChangeText={setLast4}
            keyboardType="number-pad"
            icon="lock-closed-outline"
          />
          <PrimaryButton
            label="Save Payment Method"
            onPress={() => {
              addPaymentMethod({ label, brand, last4 });
              setLabel('');
              setLast4('');
              setShowForm(false);
            }}
          />
        </View>
      ) : null}
    </Screen>
  );
}
