import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppTextField } from '@/components/forms/app-text-field';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function AddressesScreen() {
  const theme = useAppTheme();
  const { appState, addAddress } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');

  if (!appState) {
    return null;
  }

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Saved Addresses"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
        right={<IconButton name="add" onPress={() => setShowForm((current) => !current)} filled={false} />}
      />

      <View style={{ gap: theme.spacing.md }}>
        {appState.addresses.map((address) => (
          <View
            key={address.id}
            style={{
              borderRadius: theme.radii.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.card,
              borderWidth: 1,
              borderColor: address.isDefault ? theme.colors.primary : theme.colors.border,
            }}>
            <AppText variant="label">{address.label}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {address.line1}, {address.city}
            </AppText>
            {address.isDefault ? (
              <AppText variant="caption" color={theme.colors.primary} style={{ marginTop: 6 }}>
                Default
              </AppText>
            ) : null}
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
          <AppText variant="title">Add New Address</AppText>
          <AppTextField label="Label" placeholder="Home, Office, Gym..." value={label} onChangeText={setLabel} icon="bookmark-outline" />
          <AppTextField label="Address" placeholder="Street address" value={line1} onChangeText={setLine1} icon="location-outline" />
          <AppTextField label="City" placeholder="City, State" value={city} onChangeText={setCity} icon="business-outline" />
          <PrimaryButton
            label="Save Address"
            onPress={() => {
              addAddress({ label, line1, city });
              setLabel('');
              setLine1('');
              setCity('');
              setShowForm(false);
            }}
          />
        </View>
      ) : null}
    </Screen>
  );
}
