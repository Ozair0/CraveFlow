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
    orders: snapshot?.orders ?? seed.orders,
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
                trackingStops: [
                  {
                    id: 'pickup',
                    label: restaurant?.name ?? 'Restaurant',
                    address: restaurant?.address ?? '789 Park Avenue, New York, NY',
                    complete: true,
                  },
                  {
                    id: 'dropoff',
                    label: 'Delivery Address',
                    address:
                      current.addresses.find((address) => address.id === addressId)?.line1 ??
                      '8502 Preston Rd',
                    complete: false,
                  },
                ],
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
