import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Linking, Platform, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';
import type { MapCoordinate, Order } from '@/types/app';

const trackingMapStyle = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#E6EEE3' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#F7F2ED' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#DCEAF8' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{ color: '#F4EEE8' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

const mapUiColors = {
  overlayBackground: 'rgba(255,250,246,0.96)',
  overlayBorder: 'rgba(40, 28, 22, 0.08)',
  overlayText: '#241A15',
  overlayMuted: '#7E6E63',
  courier: '#1B1B1F',
  courierGlow: 'rgba(27,27,31,0.12)',
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

function getTrackingRegion(points: MapCoordinate[]) {
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 2.2, 0.0085),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 2.2, 0.0085),
  };
}

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

function CourierMarker() {
  const theme = useAppTheme();

  return (
    <View
      collapsable={false}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}>
      <View
        style={{
          position: 'absolute',
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'rgba(255,255,255,0.72)',
        }}
      />
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: mapUiColors.courier,
          borderWidth: 2.5,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.shadow.soft,
        }}>
        <Ionicons name="bicycle-outline" size={16} color="#FFFFFF" />
      </View>
    </View>
  );
}

function TrackingMapFallback() {
  const theme = useAppTheme();

  return (
    <View
      style={{
        height: 390,
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
        Live map preview is available on iOS and Android
      </AppText>
      <AppText variant="body" color={theme.colors.textMuted} align="center">
        This tracking view uses the device map renderer so you get real roads and navigation context.
      </AppText>
    </View>
  );
}

function TrackingMap({ order }: { order: Order }) {
  const theme = useAppTheme();
  const mapRef = useRef<MapView | null>(null);
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
  const points = useMemo(
    () =>
      [pickup, courier, destination, ...route].filter(
        (point): point is MapCoordinate => !!point
      ),
    [courier, destination, pickup, route]
  );
  const region = useMemo(() => getTrackingRegion(points), [points]);

  useEffect(() => {
    if (Platform.OS === 'web' || points.length < 2) {
      return;
    }

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(points, {
        animated: false,
        edgePadding: {
          top: 94,
          right: 48,
          bottom: 180,
          left: 56,
        },
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [points]);

  if (Platform.OS === 'web' || !pickup || !destination || !courier || route.length < 2) {
    return <TrackingMapFallback />;
  }

  return (
    <View
      style={{
        height: 390,
        borderRadius: 34,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        customMapStyle={trackingMapStyle}
        scrollEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        loadingEnabled
      >
        <Polyline coordinates={route} strokeColor="rgba(255,255,255,0.98)" strokeWidth={12} />
        <Polyline coordinates={route} strokeColor={theme.colors.primary} strokeWidth={5} />
        <Circle
          center={courier}
          radius={95}
          fillColor={mapUiColors.courierGlow}
          strokeColor="rgba(27,27,31,0.18)"
          strokeWidth={1}
        />

        <Marker
          coordinate={pickup}
          pinColor={theme.colors.primary}
          title={order.trackingStops[0]?.label ?? 'Shop'}
          description="Pickup location"
        />
        <Marker
          coordinate={destination}
          pinColor={mapUiColors.home}
          title={order.trackingStops[order.trackingStops.length - 1]?.label ?? 'Home'}
          description="Drop-off"
        />
        <Marker coordinate={courier} anchor={{ x: 0.5, y: 0.5 }}>
          <CourierMarker />
        </Marker>
      </MapView>

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}>
          <IconButton name="arrow-back" onPress={() => router.back()} filled={false} />
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
