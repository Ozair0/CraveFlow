import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

function TrackingMap() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        height: 360,
        borderRadius: 34,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
      }}>
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={{
            position: 'absolute',
            top: rowIndex * 52,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: theme.colors.border,
            opacity: 0.5,
          }}
        />
      ))}
      {Array.from({ length: 6 }).map((_, columnIndex) => (
        <View
          key={`column-${columnIndex}`}
          style={{
            position: 'absolute',
            left: columnIndex * 58,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: theme.colors.border,
            opacity: 0.5,
          }}
        />
      ))}
      {[
        { width: 130, top: 96, left: 86, rotate: '25deg' },
        { width: 78, top: 150, left: 186, rotate: '-35deg' },
      ].map((line, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: line.top,
            left: line.left,
            width: line.width,
            height: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.secondary,
            transform: [{ rotate: line.rotate }],
          }}
        />
      ))}
      {[
        { top: 86, left: 74 },
        { top: 146, left: 198 },
        { top: 192, left: 260 },
      ].map((pin, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: pin.top,
            left: pin.left,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#FFF2EA',
            borderWidth: 2,
            borderColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export default function TrackOrderScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState } = useAppState();
  const order = appState?.orders.find((entry) => entry.id === id);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.lg }}>
          <AppText variant="heading">Order not found</AppText>
          <PrimaryButton
            label="Back to orders"
            fullWidth={false}
            onPress={() => router.replace('/(app)/orders')}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const leadItem = order.items[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <IconButton name="arrow-back" onPress={() => router.back()} filled={false} />
          <AppText variant="title">Track Live Location</AppText>
          <View style={{ width: 42 }} />
        </View>

        <TrackingMap />

        <View
          style={{
            marginTop: -42,
            borderRadius: theme.radii.xl,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            gap: theme.spacing.md,
            ...theme.shadow.card,
          }}>
          <View>
            <AppText variant="caption" color={theme.colors.textSoft}>
              Estimated Arrival Time
            </AppText>
            <AppText variant="title" style={{ marginTop: 6 }}>
              {order.etaLabel}
            </AppText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
            <Image
              source={order.courier.avatar}
              style={{ width: 52, height: 52, borderRadius: 26 }}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <AppText variant="label">{order.courier.name}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Delivery Partner
              </AppText>
            </View>
            <IconButton name="chatbubble-outline" onPress={() => undefined} filled={false} />
            <IconButton
              name="call-outline"
              onPress={() => Linking.openURL(`tel:${order.courier.phone}`)}
              filled={false}
            />
          </View>

          <View style={{ gap: theme.spacing.md }}>
            {order.trackingStops.map((stop) => (
              <View key={stop.id} style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stop.complete ? theme.colors.primary : 'transparent',
                      borderWidth: 2,
                      borderColor: theme.colors.primary,
                    }}>
                    {stop.complete ? (
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    ) : null}
                  </View>
                  {stop.id !== order.trackingStops[order.trackingStops.length - 1]?.id ? (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        marginVertical: 4,
                        backgroundColor: theme.colors.borderStrong,
                      }}
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1, paddingBottom: theme.spacing.sm }}>
                  <AppText variant="label">{stop.label}</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {stop.address}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          <View
            style={{
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.md,
              flexDirection: 'row',
              gap: theme.spacing.md,
              alignItems: 'center',
            }}>
            <Image source={leadItem.image} style={{ width: 74, height: 74, borderRadius: 18 }} />
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color={theme.colors.textSoft}>
                Item
              </AppText>
              <AppText variant="label">{leadItem.name}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {leadItem.sizeLabel} · Qty {leadItem.quantity}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
