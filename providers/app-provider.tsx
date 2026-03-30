import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  createInitialAppState,
  getCouponByCode,
  getCouponById,
  getDishById,
  getRestaurantById,
} from '@/data/mock-data';
import type {
  AppState,
  CheckoutPayload,
  Order,
  OrderItemSnapshot,
  ReservationPayload,
  ThemeMode,
} from '@/types/app';

const STORAGE_KEY = 'delivery-gpt-state:v1';

type SignInPayload = {
  email: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  phone: string;
};

type AddAddressPayload = {
  label: string;
  line1: string;
  city: string;
};

type AddPaymentMethodPayload = {
  label: string;
  brand: 'Visa' | 'Mastercard';
  last4: string;
};

type AppContextValue = {
  appState: AppState | null;
  isReady: boolean;
  completeOnboarding: () => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (payload: SignUpPayload) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => void;
  togglePreference: (key: 'pushNotifications' | 'emailNotifications' | 'locationEnabled') => void;
  toggleFavoriteDish: (dishId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  addToCart: (payload: {
    dishId: string;
    sizeId: string;
    quantity: number;
    addOnIds: string[];
  }) => void;
  updateCartQuantity: (itemId: string, nextQuantity: number) => void;
  removeCartItem: (itemId: string) => void;
  applyCoupon: (code: string) => { ok: true } | { ok: false; message: string };
  clearCoupon: () => void;
  checkout: (payload: CheckoutPayload) => Promise<string>;
  cancelOrder: (orderId: string) => void;
  reorder: (orderId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  toggleBookingReminder: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  createBooking: (payload: ReservationPayload) => Promise<string>;
  addAddress: (payload: AddAddressPayload) => void;
  addPaymentMethod: (payload: AddPaymentMethodPayload) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createTrackingGeometry(restaurantId?: string) {
  const presets = {
    'brooklyn-bites': {
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
        pickup: { latitude: 40.74437, longitude: -73.984611 },
        dropoff: { latitude: 40.740871, longitude: -73.978766 },
      },
    },
    'savory-spot': {
      courierLocation: {
        latitude: 40.744121,
        longitude: -73.987707,
      },
      trackingRoute: [
        { latitude: 40.744699, longitude: -73.988844 },
        { latitude: 40.744623, longitude: -73.988874 },
        { latitude: 40.744536, longitude: -73.988892 },
        { latitude: 40.744572, longitude: -73.988978 },
        { latitude: 40.745366, longitude: -73.990837 },
        { latitude: 40.745421, longitude: -73.990968 },
        { latitude: 40.745483, longitude: -73.990923 },
        { latitude: 40.745847, longitude: -73.990657 },
        { latitude: 40.745979, longitude: -73.990561 },
        { latitude: 40.746038, longitude: -73.990518 },
        { latitude: 40.745984, longitude: -73.99039 },
        { latitude: 40.745323, longitude: -73.988834 },
        { latitude: 40.745289, longitude: -73.988753 },
        { latitude: 40.745241, longitude: -73.988636 },
        { latitude: 40.745006, longitude: -73.988072 },
        { latitude: 40.744729, longitude: -73.987419 },
        { latitude: 40.744678, longitude: -73.987301 },
        { latitude: 40.74463, longitude: -73.987336 },
        { latitude: 40.744121, longitude: -73.987707 },
        { latitude: 40.744067, longitude: -73.987745 },
        { latitude: 40.744005, longitude: -73.98779 },
        { latitude: 40.743509, longitude: -73.988151 },
        { latitude: 40.743457, longitude: -73.988191 },
        { latitude: 40.743405, longitude: -73.988089 },
        { latitude: 40.742818, longitude: -73.986704 },
        { latitude: 40.742771, longitude: -73.986598 },
        { latitude: 40.74273, longitude: -73.9865 },
        { latitude: 40.74218, longitude: -73.985181 },
        { latitude: 40.742156, longitude: -73.985123 },
        { latitude: 40.742124, longitude: -73.985046 },
        { latitude: 40.742071, longitude: -73.984918 },
        { latitude: 40.742041, longitude: -73.984845 },
        { latitude: 40.741675, longitude: -73.983986 },
      ],
      stopCoordinates: {
        pickup: { latitude: 40.744699, longitude: -73.988844 },
        dropoff: { latitude: 40.741675, longitude: -73.983986 },
      },
    },
    'taco-trail': {
      courierLocation: {
        latitude: 40.720656,
        longitude: -73.995038,
      },
      trackingRoute: [
        { latitude: 40.721379, longitude: -73.997162 },
        { latitude: 40.721198, longitude: -73.996647 },
        { latitude: 40.721174, longitude: -73.996575 },
        { latitude: 40.721151, longitude: -73.996508 },
        { latitude: 40.720921, longitude: -73.995824 },
        { latitude: 40.720896, longitude: -73.99575 },
        { latitude: 40.720875, longitude: -73.995689 },
        { latitude: 40.720656, longitude: -73.995038 },
        { latitude: 40.720632, longitude: -73.994966 },
        { latitude: 40.720611, longitude: -73.994905 },
        { latitude: 40.720394, longitude: -73.994265 },
        { latitude: 40.720373, longitude: -73.994202 },
        { latitude: 40.720343, longitude: -73.994113 },
        { latitude: 40.720302, longitude: -73.993994 },
        { latitude: 40.720245, longitude: -73.993904 },
        { latitude: 40.720181, longitude: -73.993802 },
        { latitude: 40.7201, longitude: -73.993549 },
        { latitude: 40.720075, longitude: -73.993471 },
        { latitude: 40.719965, longitude: -73.993126 },
        { latitude: 40.71995, longitude: -73.993077 },
        { latitude: 40.719911, longitude: -73.992948 },
        { latitude: 40.719813, longitude: -73.992994 },
        { latitude: 40.719751, longitude: -73.993024 },
        { latitude: 40.71952, longitude: -73.993145 },
        { latitude: 40.719458, longitude: -73.993178 },
      ],
      stopCoordinates: {
        pickup: { latitude: 40.721379, longitude: -73.997162 },
        dropoff: { latitude: 40.719458, longitude: -73.993178 },
      },
    },
    'grill-lab': {
      courierLocation: {
        latitude: 40.7056,
        longitude: -74.009041,
      },
      trackingRoute: [
        { latitude: 40.704712, longitude: -74.01186 },
        { latitude: 40.704718, longitude: -74.011691 },
        { latitude: 40.70472, longitude: -74.01164 },
        { latitude: 40.704723, longitude: -74.011611 },
        { latitude: 40.704728, longitude: -74.011592 },
        { latitude: 40.704737, longitude: -74.011577 },
        { latitude: 40.704746, longitude: -74.011566 },
        { latitude: 40.704761, longitude: -74.011553 },
        { latitude: 40.70495, longitude: -74.011544 },
        { latitude: 40.704994, longitude: -74.011542 },
        { latitude: 40.704997, longitude: -74.011532 },
        { latitude: 40.705006, longitude: -74.0115 },
        { latitude: 40.705017, longitude: -74.011466 },
        { latitude: 40.705025, longitude: -74.011442 },
        { latitude: 40.705033, longitude: -74.011412 },
        { latitude: 40.70504, longitude: -74.011368 },
        { latitude: 40.705083, longitude: -74.010766 },
        { latitude: 40.705098, longitude: -74.010589 },
        { latitude: 40.705151, longitude: -74.010106 },
        { latitude: 40.705169, longitude: -74.009982 },
        { latitude: 40.705181, longitude: -74.009906 },
        { latitude: 40.705223, longitude: -74.00966 },
        { latitude: 40.705278, longitude: -74.009299 },
        { latitude: 40.705289, longitude: -74.009228 },
        { latitude: 40.70531, longitude: -74.009094 },
        { latitude: 40.705317, longitude: -74.009037 },
        { latitude: 40.705355, longitude: -74.009042 },
        { latitude: 40.705493, longitude: -74.009057 },
        { latitude: 40.705522, longitude: -74.009057 },
        { latitude: 40.705531, longitude: -74.009058 },
        { latitude: 40.70557, longitude: -74.009053 },
        { latitude: 40.7056, longitude: -74.009041 },
        { latitude: 40.705626, longitude: -74.009028 },
        { latitude: 40.705928, longitude: -74.008868 },
        { latitude: 40.705969, longitude: -74.008845 },
        { latitude: 40.705981, longitude: -74.008835 },
        { latitude: 40.705988, longitude: -74.008818 },
        { latitude: 40.705992, longitude: -74.008798 },
        { latitude: 40.705992, longitude: -74.008777 },
        { latitude: 40.705575, longitude: -74.007995 },
        { latitude: 40.705544, longitude: -74.007941 },
        { latitude: 40.705511, longitude: -74.007881 },
        { latitude: 40.705293, longitude: -74.007534 },
        { latitude: 40.705265, longitude: -74.007494 },
        { latitude: 40.705243, longitude: -74.007467 },
        { latitude: 40.705209, longitude: -74.007433 },
        { latitude: 40.70518, longitude: -74.007407 },
        { latitude: 40.705235, longitude: -74.007328 },
        { latitude: 40.705501, longitude: -74.00694 },
        { latitude: 40.705604, longitude: -74.006794 },
        { latitude: 40.705634, longitude: -74.006753 },
        { latitude: 40.705706, longitude: -74.006865 },
        { latitude: 40.706002, longitude: -74.007355 },
        { latitude: 40.706036, longitude: -74.007411 },
        { latitude: 40.706063, longitude: -74.007454 },
        { latitude: 40.706089, longitude: -74.0075 },
        { latitude: 40.706355, longitude: -74.007988 },
        { latitude: 40.706485, longitude: -74.008213 },
        { latitude: 40.70662, longitude: -74.00844 },
      ],
      stopCoordinates: {
        pickup: { latitude: 40.704712, longitude: -74.01186 },
        dropoff: { latitude: 40.70662, longitude: -74.00844 },
      },
    },
  };

  return presets[restaurantId as keyof typeof presets] ?? presets['brooklyn-bites'];
}

function hydrateTrackingOrder(order: Order): Order {
  const geometry = createTrackingGeometry(order.restaurantId);

  return {
    ...order,
    courierLocation: order.courierLocation ?? geometry.courierLocation,
    trackingRoute:
      order.trackingRoute && order.trackingRoute.length > 0
        ? order.trackingRoute
        : geometry.trackingRoute,
    trackingStops: order.trackingStops.map((stop, index) => {
      const fallbackCoordinate =
        stop.coordinate ??
        geometry.stopCoordinates[
          stop.id === 'pickup' || index === 0 ? 'pickup' : 'dropoff'
        ];

      return fallbackCoordinate
        ? {
            ...stop,
            coordinate: fallbackCoordinate,
          }
        : stop;
    }),
  };
}

function mergeOrderWithSeed(order: Order, seedOrder?: Order): Order {
  if (!seedOrder) {
    return hydrateTrackingOrder(order);
  }

  return hydrateTrackingOrder({
    ...seedOrder,
    ...order,
    courier: {
      ...seedOrder.courier,
      ...order.courier,
    },
    trackingStops:
      order.trackingStops?.length > 0
        ? order.trackingStops.map((stop) => {
            const seedStop = seedOrder.trackingStops.find(
              (candidate) => candidate.id === stop.id
            );

            return seedStop ? { ...seedStop, ...stop } : stop;
          })
        : seedOrder.trackingStops,
  });
}

function mergeState(snapshot: Partial<AppState> | null): AppState {
  const seed = createInitialAppState();

  return {
    ...seed,
    ...snapshot,
    session: {
      ...seed.session,
      ...snapshot?.session,
      user: {
        ...seed.session.user,
        ...snapshot?.session?.user,
      },
    },
    settings: {
      ...seed.settings,
      ...snapshot?.settings,
    },
    favorites: {
      ...seed.favorites,
      ...snapshot?.favorites,
    },
    cart: {
      ...seed.cart,
      ...snapshot?.cart,
      items: snapshot?.cart?.items ?? seed.cart.items,
    },
    notifications: snapshot?.notifications ?? seed.notifications,
    orders:
      snapshot?.orders?.map((order) =>
        mergeOrderWithSeed(
          order,
          seed.orders.find((candidate) => candidate.id === order.id)
        )
      ) ?? seed.orders,
    bookings: snapshot?.bookings ?? seed.bookings,
    addresses: snapshot?.addresses ?? seed.addresses,
    paymentMethods: snapshot?.paymentMethods ?? seed.paymentMethods,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = stored ? (JSON.parse(stored) as Partial<AppState>) : null;
        await delay(600);
        if (isMounted) {
          setAppState(mergeState(parsed));
          setIsReady(true);
        }
      } catch {
        if (isMounted) {
          setAppState(createInitialAppState());
          setIsReady(true);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !appState) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appState)).catch(() => undefined);
  }, [appState, isReady]);

  const updateState = (updater: (current: AppState) => AppState) => {
    setAppState((current) => (current ? updater(current) : current));
  };

  const value = useMemo<AppContextValue>(
    () => ({
      appState,
      isReady,
      completeOnboarding: async () => {
        await delay(250);
        updateState((current) => ({
          ...current,
          session: {
            ...current.session,
            hasSeenOnboarding: true,
          },
        }));
      },
      signIn: async ({ email }) => {
        await delay(500);
        updateState((current) => ({
          ...current,
          session: {
            ...current.session,
            isAuthenticated: true,
            user: {
              ...current.session.user,
              email,
            },
          },
        }));
      },
      signUp: async ({ name, email, phone }) => {
        await delay(550);
        updateState((current) => ({
          ...current,
          session: {
            ...current.session,
            hasSeenOnboarding: true,
            isAuthenticated: true,
            user: {
              ...current.session.user,
              name,
              email,
              phone,
            },
          },
        }));
      },
      signOut: async () => {
        await delay(120);
        updateState((current) => ({
          ...current,
          session: {
            ...current.session,
            isAuthenticated: false,
          },
        }));
      },
      updateProfile: async ({ name, email, phone }) => {
        await delay(240);
        updateState((current) => ({
          ...current,
          session: {
            ...current.session,
            user: {
              ...current.session.user,
              name,
              email,
              phone,
            },
          },
        }));
      },
      setThemeMode: (mode) => {
        updateState((current) => ({
          ...current,
          settings: {
            ...current.settings,
            themeMode: mode,
          },
        }));
      },
      togglePreference: (key) => {
        updateState((current) => ({
          ...current,
          settings: {
            ...current.settings,
            [key]: !current.settings[key],
          },
        }));
      },
      toggleFavoriteDish: (dishId) => {
        updateState((current) => {
          const exists = current.favorites.dishIds.includes(dishId);

          return {
            ...current,
            favorites: {
              ...current.favorites,
              dishIds: exists
                ? current.favorites.dishIds.filter((id) => id !== dishId)
                : [...current.favorites.dishIds, dishId],
            },
          };
        });
      },
      toggleFavoriteRestaurant: (restaurantId) => {
        updateState((current) => {
          const exists = current.favorites.restaurantIds.includes(restaurantId);

          return {
            ...current,
            favorites: {
              ...current.favorites,
              restaurantIds: exists
                ? current.favorites.restaurantIds.filter((id) => id !== restaurantId)
                : [...current.favorites.restaurantIds, restaurantId],
            },
          };
        });
      },
      addToCart: ({ dishId, sizeId, quantity, addOnIds }) => {
        updateState((current) => {
          const existing = current.cart.items.find(
            (item) =>
              item.dishId === dishId &&
              item.sizeId === sizeId &&
              JSON.stringify(item.addOnIds) === JSON.stringify(addOnIds)
          );

          if (existing) {
            return {
              ...current,
              cart: {
                ...current.cart,
                items: current.cart.items.map((item) =>
                  item.id === existing.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              },
            };
          }

          return {
            ...current,
            cart: {
              ...current.cart,
              items: [
                ...current.cart.items,
                {
                  id: `cart-${Date.now()}`,
                  dishId,
                  sizeId,
                  quantity,
                  addOnIds,
                },
              ],
            },
          };
        });
      },
      updateCartQuantity: (itemId, nextQuantity) => {
        if (nextQuantity <= 0) {
          updateState((current) => ({
            ...current,
            cart: {
              ...current.cart,
              items: current.cart.items.filter((item) => item.id !== itemId),
            },
          }));
          return;
        }

        updateState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            items: current.cart.items.map((item) =>
              item.id === itemId ? { ...item, quantity: nextQuantity } : item
            ),
          },
        }));
      },
      removeCartItem: (itemId) => {
        updateState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            items: current.cart.items.filter((item) => item.id !== itemId),
          },
        }));
      },
      applyCoupon: (code) => {
        const coupon = getCouponByCode(code);
        if (!coupon) {
          return { ok: false, message: 'Coupon code not found.' };
        }

        updateState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            appliedCouponId: coupon.id,
          },
        }));

        return { ok: true };
      },
      clearCoupon: () => {
        updateState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            appliedCouponId: undefined,
          },
        }));
      },
      checkout: async ({ addressId }) => {
        await delay(700);

        let createdOrderId = '';
        updateState((current) => {
          const cartItems: OrderItemSnapshot[] = current.cart.items
            .map((item) => {
              const dish = getDishById(item.dishId);
              const size = dish?.sizes.find((entry) => entry.id === item.sizeId);
              if (!dish || !size) {
                return null;
              }

              const addOnTotal = dish.addOns
                .filter((addOn) => item.addOnIds.includes(addOn.id))
                .reduce((sum, addOn) => sum + addOn.price, 0);

              return {
                dishId: dish.id,
                name: dish.name,
                image: dish.image,
                sizeId: size.id,
                sizeLabel: size.label,
                quantity: item.quantity,
                unitPrice: size.price + addOnTotal,
                addOnIds: item.addOnIds,
                addOnLabel:
                  item.addOnIds.length === 0
                    ? 'No extras'
                    : dish.addOns
                        .filter((addOn) => item.addOnIds.includes(addOn.id))
                        .map((addOn) => addOn.label)
                        .join(', '),
              };
            })
            .filter((item): item is OrderItemSnapshot => Boolean(item));

          const primaryItem = cartItems[0];
          const dish = primaryItem ? getDishById(primaryItem.dishId) : undefined;
          const restaurant = dish ? getRestaurantById(dish.restaurantId) : undefined;
          const subtotal = cartItems.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          );
          const serviceFee = subtotal > 0 ? 1.5 : 0;
          const deliveryFee = subtotal >= 20 ? 0 : 2.99;
          const coupon = getCouponById(current.cart.appliedCouponId);
          const discountAmount = coupon ? Math.min(subtotal * 0.15, 8) : 0;
          const total = subtotal + deliveryFee + serviceFee - discountAmount;
          createdOrderId = `#FD${Math.floor(100000 + Math.random() * 899999)}`;
          const trackingGeometry = createTrackingGeometry(restaurant?.id);

          return {
            ...current,
            orders: [
              {
                id: createdOrderId,
                restaurantId: restaurant?.id ?? 'brooklyn-bites',
                restaurantName: restaurant?.name ?? 'Brooklyn Bites',
                status: 'active',
                items: cartItems,
                subtotal,
                deliveryFee,
                serviceFee,
                discountAmount,
                total,
                etaLabel: '07:55 PM - 08:00 PM',
                placedAtLabel: 'Just now',
                activeBadgeLabel: 'Active Order',
                courier: {
                  name: 'Charlotte Taylor',
                  avatar:
                    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
                  phone: '+1 (212) 555-0119',
                  vehicle: 'Scooter',
                },
                courierLocation: trackingGeometry.courierLocation,
                trackingStops: [
                  {
                    id: 'pickup',
                    label: restaurant?.name ?? 'Restaurant',
                    address: restaurant?.address ?? '789 Park Avenue, New York, NY',
                    complete: true,
                    coordinate: trackingGeometry.stopCoordinates.pickup,
                  },
                  {
                    id: 'dropoff',
                    label: 'Delivery Address',
                    address:
                      current.addresses.find((address) => address.id === addressId)?.line1 ??
                      '8502 Preston Rd',
                    complete: false,
                    coordinate: trackingGeometry.stopCoordinates.dropoff,
                  },
                ],
                trackingRoute: trackingGeometry.trackingRoute,
              },
              ...current.orders,
            ],
            cart: {
              items: [],
            },
          };
        });

        return createdOrderId;
      },
      cancelOrder: (orderId) => {
        updateState((current) => ({
          ...current,
          orders: current.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'cancelled',
                  activeBadgeLabel: 'Cancelled',
                  etaLabel: 'Cancelled by user',
                }
              : order
          ),
        }));
      },
      reorder: (orderId) => {
        updateState((current) => {
          const order = current.orders.find((entry) => entry.id === orderId);
          if (!order) {
            return current;
          }

          return {
            ...current,
            cart: {
              ...current.cart,
              items: order.items.map((item, index) => ({
                id: `cart-reorder-${orderId}-${index}`,
                dishId: item.dishId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                addOnIds: item.addOnIds,
              })),
            },
          };
        });
      },
      markNotificationRead: (notificationId) => {
        updateState((current) => ({
          ...current,
          notifications: current.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isNew: false } : notification
          ),
        }));
      },
      markAllNotificationsRead: () => {
        updateState((current) => ({
          ...current,
          notifications: current.notifications.map((notification) => ({
            ...notification,
            isNew: false,
          })),
        }));
      },
      toggleBookingReminder: (bookingId) => {
        updateState((current) => ({
          ...current,
          bookings: current.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, reminderEnabled: !booking.reminderEnabled }
              : booking
          ),
        }));
      },
      cancelBooking: (bookingId) => {
        updateState((current) => ({
          ...current,
          bookings: current.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
          ),
        }));
      },
      createBooking: async ({ restaurantId, bookingDateLabel, guests }) => {
        await delay(450);
        const restaurant = getRestaurantById(restaurantId);
        const id = `#RSV${Math.floor(1000 + Math.random() * 8999)}`;
        updateState((current) => ({
          ...current,
          bookings: [
            {
              id,
              restaurantId,
              restaurantName: restaurant?.name ?? 'Restaurant',
              status: 'upcoming',
              reminderEnabled: true,
              guests,
              bookingDateLabel,
              image: restaurant?.image ?? '',
              address: restaurant?.address ?? '',
              distanceLabel: `${restaurant?.deliveryTimeMinutes ?? 15} min · ${restaurant?.distanceMiles ?? 1.5} miles`,
            },
            ...current.bookings,
          ],
        }));

        return id;
      },
      addAddress: ({ label, line1, city }) => {
        updateState((current) => ({
          ...current,
          addresses: [
            ...current.addresses,
            {
              id: `address-${Date.now()}`,
              label,
              line1,
              city,
              isDefault: false,
            },
          ],
        }));
      },
      addPaymentMethod: ({ label, brand, last4 }) => {
        updateState((current) => ({
          ...current,
          paymentMethods: [
            ...current.paymentMethods,
            {
              id: `card-${Date.now()}`,
              label,
              brand,
              last4,
              isDefault: false,
            },
          ],
        }));
      },
    }),
    [appState, isReady]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }

  return context;
}
