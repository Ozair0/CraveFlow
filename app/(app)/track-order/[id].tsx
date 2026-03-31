import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';
import type { MapCoordinate, Order } from '@/types/app';

const mapUiColors = {
  overlayBackground: 'rgba(255,250,246,0.96)',
  overlayBorder: 'rgba(40, 28, 22, 0.08)',
  overlayText: '#241A15',
  overlayMuted: '#7E6E63',
  courier: '#1B1B1F',
  courierGlow: 'rgba(255,122,26,0.10)',
  home: '#FFB84D',
};

const fallbackTrackingGeometryByOrderId: Record<
  string,
  {
    courierLocation: MapCoordinate;
    trackingRoute: MapCoordinate[];
    stopCoordinates: Record<string, MapCoordinate>;
  }
> = {
  '#FD785462': {
    courierLocation: {
      latitude: 40.743291,
      longitude: -73.980148,
    },
    trackingRoute: [
      { latitude: 40.74437, longitude: -73.984611 },
      { latitude: 40.744595, longitude: -73.985149 },
      { latitude: 40.744631, longitude: -73.985243 },
      { latitude: 40.744685, longitude: -73.985204 },
      { latitude: 40.74519, longitude: -73.984838 },
      { latitude: 40.74525, longitude: -73.984794 },
      { latitude: 40.745208, longitude: -73.984694 },
      { latitude: 40.744625, longitude: -73.983315 },
      { latitude: 40.744597, longitude: -73.983245 },
      { latitude: 40.744546, longitude: -73.983119 },
      { latitude: 40.744511, longitude: -73.983035 },
      { latitude: 40.743946, longitude: -73.981699 },
      { latitude: 40.743932, longitude: -73.981666 },
      { latitude: 40.743889, longitude: -73.981565 },
      { latitude: 40.743845, longitude: -73.981462 },
      { latitude: 40.743291, longitude: -73.980148 },
      { latitude: 40.743267, longitude: -73.980091 },
      { latitude: 40.743215, longitude: -73.979969 },
      { latitude: 40.743151, longitude: -73.979818 },
      { latitude: 40.742536, longitude: -73.97835 },
      { latitude: 40.742327, longitude: -73.977858 },
      { latitude: 40.742274, longitude: -73.97772 },
      { latitude: 40.742212, longitude: -73.977764 },
      { latitude: 40.741708, longitude: -73.978132 },
      { latitude: 40.741655, longitude: -73.97817 },
      { latitude: 40.741582, longitude: -73.978225 },
      { latitude: 40.74124, longitude: -73.978498 },
      { latitude: 40.741142, longitude: -73.978571 },
      { latitude: 40.7411, longitude: -73.978601 },
      { latitude: 40.741043, longitude: -73.978642 },
      { latitude: 40.74098, longitude: -73.978688 },
      { latitude: 40.740871, longitude: -73.978766 },
    ],
    stopCoordinates: {
      pickup: {
        latitude: 40.74437,
        longitude: -73.984611,
      },
      dropoff: {
        latitude: 40.740871,
        longitude: -73.978766,
      },
    },
  },
};

function MarkerLegend() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 92,
        left: 18,
        borderRadius: theme.radii.pill,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: mapUiColors.overlayBackground,
        borderWidth: 1,
        borderColor: mapUiColors.overlayBorder,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...theme.shadow.soft,
      }}>
      {[
        { label: 'Shop', color: theme.colors.primary },
        { label: 'Courier', color: mapUiColors.courier },
        { label: 'Home', color: mapUiColors.home },
      ].map((item) => (
        <View
          key={item.label}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: item.color,
            }}
          />
          <AppText variant="caption" color={mapUiColors.overlayText}>
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function toXY(
  coord: MapCoordinate,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  padding: number
) {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const x = padding + ((coord.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * innerW;
  const y = padding + ((bounds.maxLat - coord.latitude) / (bounds.maxLat - bounds.minLat || 1)) * innerH;
  return { x, y };
}

function MockMapRoute({
  route,
  bounds,
  width,
  height,
  padding,
  color,
}: {
  route: MapCoordinate[];
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  width: number;
  height: number;
  padding: number;
  color: string;
}) {
  return (
    <>
      {route.map((coord, i) => {
        if (i === 0) return null;
        const from = toXY(route[i - 1], bounds, width, height, padding);
        const to = toXY(coord, bounds, width, height, padding);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: from.x,
              top: from.y - 2,
              width: length,
              height: 4,
              backgroundColor: color,
              borderRadius: 2,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: 'left center',
            }}
          />
        );
      })}
    </>
  );
}

function MockMapPin({
  coord,
  bounds,
  width,
  height,
  padding,
  color,
  label,
  size = 16,
}: {
  coord: MapCoordinate;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  width: number;
  height: number;
  padding: number;
  color: string;
  label: string;
  size?: number;
}) {
  const { x, y } = toXY(coord, bounds, width, height, padding);
  return (
    <View style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2.5,
          borderColor: '#FFFFFF',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          marginTop: 4,
          backgroundColor: mapUiColors.overlayBackground,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: mapUiColors.overlayBorder,
        }}>
        <AppText variant="caption" style={{ fontSize: 9 }} color={mapUiColors.overlayText}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

function TrackingMap({ order }: { order: Order }) {
  const theme = useAppTheme();
  const fallbackGeometry = fallbackTrackingGeometryByOrderId[order.id];
  const pickupStop = order.trackingStops[0];
  const destinationStop = order.trackingStops[order.trackingStops.length - 1];
  const pickup =
    pickupStop?.coordinate ??
    (pickupStop ? fallbackGeometry?.stopCoordinates[pickupStop.id] : undefined);
  const destination =
    destinationStop?.coordinate ??
    (destinationStop ? fallbackGeometry?.stopCoordinates[destinationStop.id] : undefined);
  const courier = order.courierLocation ?? fallbackGeometry?.courierLocation;
  const route = useMemo(
    () =>
      order.trackingRoute?.length
        ? order.trackingRoute
        : fallbackGeometry?.trackingRoute?.length
          ? fallbackGeometry.trackingRoute
          : [pickup, courier, destination].filter((point): point is MapCoordinate => !!point),
    [courier, destination, fallbackGeometry?.trackingRoute, order.trackingRoute, pickup]
  );

  const MAP_W = 360;
  const MAP_H = 390;
  const MAP_PAD = 50;

  const bounds = useMemo(() => {
    const all = [pickup, courier, destination, ...route].filter(
      (p): p is MapCoordinate => !!p
    );
    if (all.length === 0) return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    const lats = all.map((p) => p.latitude);
    const lngs = all.map((p) => p.longitude);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [pickup, courier, destination, route]);

  if (!pickup || !destination || !courier || route.length < 2) {
    return (
      <View
        style={{
          height: MAP_H,
          borderRadius: 34,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.xl,
          gap: theme.spacing.sm,
        }}>
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: theme.colors.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="map-outline" size={28} color={theme.colors.primary} />
        </View>
        <AppText variant="title" align="center">
          Tracking data unavailable
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={{
        height: MAP_H,
        borderRadius: 34,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: '#F4EEE8',
      }}>
      {/* Water-like background patches */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#F4EEE8',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: -30,
          width: 180,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#DCEAF8',
          opacity: 0.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: -20,
          width: 140,
          height: 90,
          borderRadius: 50,
          backgroundColor: '#E6EEE3',
          opacity: 0.6,
        }}
      />

      {/* Route line (white outline) */}
      <MockMapRoute
        route={route}
        bounds={bounds}
        width={MAP_W}
        height={MAP_H}
        padding={MAP_PAD}
        color="rgba(255,255,255,0.95)"
      />
      {/* Route line (primary color) */}
      <MockMapRoute
        route={route}
        bounds={bounds}
        width={MAP_W}
        height={MAP_H}
        padding={MAP_PAD}
        color={theme.colors.primary}
      />

      {/* Courier glow */}
      {(() => {
        const pos = toXY(courier, bounds, MAP_W, MAP_H, MAP_PAD);
        return (
          <View
            style={{
              position: 'absolute',
              left: pos.x - 22,
              top: pos.y - 22,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: mapUiColors.courierGlow,
              borderWidth: 1,
              borderColor: 'rgba(255,122,26,0.18)',
            }}
          />
        );
      })()}

      {/* Markers */}
      <MockMapPin
        coord={pickup}
        bounds={bounds}
        width={MAP_W}
        height={MAP_H}
        padding={MAP_PAD}
        color={theme.colors.primary}
        label={pickupStop?.label ?? 'Shop'}
      />
      <MockMapPin
        coord={destination}
        bounds={bounds}
        width={MAP_W}
        height={MAP_H}
        padding={MAP_PAD}
        color={mapUiColors.home}
        label={destinationStop?.label ?? 'Home'}
      />
      <MockMapPin
        coord={courier}
        bounds={bounds}
        width={MAP_W}
        height={MAP_H}
        padding={MAP_PAD}
        color={mapUiColors.courier}
        label={order.courier.name}
        size={20}
      />

      <MarkerLegend />

      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 18,
          borderRadius: theme.radii.pill,
          paddingHorizontal: 12,
          paddingVertical: 7,
          backgroundColor: mapUiColors.overlayBackground,
          borderWidth: 1,
          borderColor: mapUiColors.overlayBorder,
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
        <AppText variant="caption" color={mapUiColors.overlayText}>
          Live route
        </AppText>
      </View>
    </View>
  );
}

export default function TrackOrderScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState } = useAppState();
  const order = appState?.orders.find((entry) => entry.id === id);

  const handleBack = () => {
    router.dismissTo('/(app)/orders');
  };

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}>
          <IconButton name="arrow-back" onPress={handleBack} filled={false} />
          <AppText variant="title">Track Live Location</AppText>
          <View style={{ width: 42 }} />
        </View>

        <TrackingMap order={order} />

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
            <ExpoImage
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
            <ExpoImage
              source={leadItem.image}
              style={{ width: 74, height: 74, borderRadius: 18 }}
            />
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
