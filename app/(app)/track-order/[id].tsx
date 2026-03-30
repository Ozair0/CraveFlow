import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

const routePoints = [
  { x: 74, y: 96 },
  { x: 128, y: 124 },
  { x: 182, y: 154 },
  { x: 214, y: 196 },
  { x: 266, y: 246 },
];

const mapRoads = [
  { top: 18, left: -24, width: 168, height: 46, rotate: '16deg' },
  { top: 34, left: 160, width: 198, height: 48, rotate: '-22deg' },
  { top: 106, left: -10, width: 210, height: 42, rotate: '-18deg' },
  { top: 118, left: 180, width: 166, height: 42, rotate: '18deg' },
  { top: 214, left: -36, width: 184, height: 44, rotate: '22deg' },
  { top: 238, left: 122, width: 238, height: 46, rotate: '-16deg' },
  { top: 74, left: 72, width: 56, height: 230, rotate: '0deg' },
  { top: 24, left: 222, width: 52, height: 262, rotate: '0deg' },
];

function buildSegment(
  start: (typeof routePoints)[number],
  end: (typeof routePoints)[number]
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const width = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    left: start.x,
    top: start.y,
    width,
    angle,
  };
}

function MapPin({
  top,
  left,
  active,
  icon,
}: {
  top: number;
  left: number;
  active?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const theme = useAppTheme();
  const pinBackground = active ? theme.colors.primary : '#FFF7F1';

  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: pinBackground,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.soft,
      }}>
      {icon ? (
        <Ionicons name={icon} size={14} color={active ? '#FFFFFF' : theme.colors.primary} />
      ) : (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: active ? '#FFFFFF' : theme.colors.primary,
          }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -8,
          width: 10,
          height: 10,
          borderBottomLeftRadius: 3,
          backgroundColor: pinBackground,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderColor: theme.colors.primary,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {active ? (
        <View
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,107,44,0.22)',
          }}
        />
      ) : null}
    </View>
  );
}

function TrackingMap() {
  const theme = useAppTheme();
  const routeSegments = routePoints.slice(0, -1).map((point, index) => buildSegment(point, routePoints[index + 1]));

  return (
    <View
      style={{
        height: 390,
        borderRadius: 34,
        backgroundColor: '#EEE7DE',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <LinearGradient
        colors={['#F9F4EE', '#F1E9E1']}
        style={{ position: 'absolute', inset: 0 }}
      />

      {mapRoads.map((road, index) => (
        <View
          key={`road-${index}`}
          style={{
            position: 'absolute',
            top: road.top,
            left: road.left,
            width: road.width,
            height: road.height,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.94)',
            borderWidth: 1,
            borderColor: 'rgba(233,221,209,0.95)',
            transform: [{ rotate: road.rotate }],
          }}
        />
      ))}

      {[
        { top: 48, left: 28, width: 78, height: 54 },
        { top: 58, left: 132, width: 62, height: 76 },
        { top: 72, left: 282, width: 46, height: 64 },
        { top: 170, left: 24, width: 94, height: 62 },
        { top: 174, left: 236, width: 82, height: 56 },
        { top: 280, left: 40, width: 68, height: 46 },
        { top: 290, left: 160, width: 74, height: 54 },
      ].map((block, index) => (
        <View
          key={`block-${index}`}
          style={{
            position: 'absolute',
            top: block.top,
            left: block.left,
            width: block.width,
            height: block.height,
            borderRadius: 20,
            backgroundColor: 'rgba(233, 224, 214, 0.75)',
          }}
        />
      ))}

      {routeSegments.map((segment, index) => (
        <View
          key={`route-shell-${index}`}
          style={{
            position: 'absolute',
            left: segment.left,
            top: segment.top,
            width: segment.width,
            height: 12,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.92)',
            transform: [{ rotate: `${segment.angle}deg` }, { translateY: -6 }],
          }}
        />
      ))}
      {routeSegments.map((segment, index) => (
        <View
          key={`route-core-${index}`}
          style={{
            position: 'absolute',
            left: segment.left,
            top: segment.top,
            width: segment.width,
            height: 5,
            borderRadius: 999,
            backgroundColor: theme.colors.secondary,
            transform: [{ rotate: `${segment.angle}deg` }, { translateY: -2.5 }],
          }}
        />
      ))}

      <MapPin top={78} left={56} />
      <MapPin top={182} left={198} active icon="bicycle-outline" />
      <MapPin top={232} left={254} />

      <View
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          borderRadius: theme.radii.pill,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: 'rgba(255,255,255,0.96)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          ...theme.shadow.soft,
        }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
          }}
        />
        <AppText variant="caption">Live route</AppText>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 82,
          right: 20,
        }}>
        <IconButton name="locate-outline" size={18} />
      </View>
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
            borderWidth: 1,
            borderColor: theme.colors.border,
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
