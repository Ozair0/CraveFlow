import { coupons, dishes, getCouponById, getDishById, getRestaurantById, restaurants } from '@/data/mock-data';
import type {
  AppState,
  BookingStatus,
  Coupon,
  NotificationGroup,
  NotificationItem,
  OrderStatus,
} from '@/types/app';

export type CartLineItem = {
  item: AppState['cart']['items'][number];
  dish: NonNullable<ReturnType<typeof getDishById>>;
  restaurant: NonNullable<ReturnType<typeof getRestaurantById>>;
  size: NonNullable<NonNullable<ReturnType<typeof getDishById>>['sizes'][number]>;
  addOns: NonNullable<ReturnType<typeof getDishById>>['addOns'];
  unitPrice: number;
  lineTotal: number;
};

export function getFavoriteDishes(appState: AppState) {
  return dishes.filter((dish) => appState.favorites.dishIds.includes(dish.id));
}

export function getFavoriteRestaurants(appState: AppState) {
  return restaurants.filter((restaurant) => appState.favorites.restaurantIds.includes(restaurant.id));
}

export function getCartLineItems(appState: AppState): CartLineItem[] {
  return appState.cart.items
    .map((item) => {
      const dish = getDishById(item.dishId);
      const restaurant = dish ? getRestaurantById(dish.restaurantId) : undefined;
      const size = dish?.sizes.find((entry) => entry.id === item.sizeId);
      const addOns = dish?.addOns.filter((entry) => item.addOnIds.includes(entry.id)) ?? [];

      if (!dish || !restaurant || !size) {
        return null;
      }

      const unitPrice = size.price + addOns.reduce((sum, addOn) => sum + addOn.price, 0);

      return {
        item,
        dish,
        restaurant,
        size,
        addOns,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter(
      (line): line is CartLineItem => Boolean(line)
    );
}

export function getCartSummary(appState: AppState) {
  const lineItems = getCartLineItems(appState);
  const subtotal = lineItems.reduce((sum: number, item: CartLineItem) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal >= 20 || subtotal === 0 ? 0 : 2.99;
  const serviceFee = subtotal === 0 ? 0 : 1.5;
  const appliedCoupon = getCouponById(appState.cart.appliedCouponId);
  const discount = appliedCoupon ? Math.min(subtotal * 0.15, 8) : 0;
  const total = subtotal + deliveryFee + serviceFee - discount;

  return {
    lineItems,
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    total,
    appliedCoupon,
  };
}

export function getOrderGroups(appState: AppState, status: OrderStatus) {
  return appState.orders.filter((order) => order.status === status);
}

export function getBookingGroups(appState: AppState, status: BookingStatus) {
  return appState.bookings.filter((booking) => booking.status === status);
}

export function groupNotifications(notifications: NotificationItem[]) {
  return notifications.reduce<Record<NotificationGroup, NotificationItem[]>>(
    (groups, notification) => {
      groups[notification.group].push(notification);
      return groups;
    },
    {
      today: [],
      yesterday: [],
      earlier: [],
    }
  );
}

export function searchDishes(query: string, categoryId?: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return dishes.filter((dish) => {
    const queryMatches =
      normalizedQuery.length === 0 ||
      dish.name.toLowerCase().includes(normalizedQuery) ||
      dish.shortDescription.toLowerCase().includes(normalizedQuery) ||
      dish.cuisine.toLowerCase().includes(normalizedQuery);
    const categoryMatches = !categoryId || categoryId === 'all' || dish.categoryIds.includes(categoryId);

    return queryMatches && categoryMatches;
  });
}

export function searchRestaurants(query: string, categoryId?: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return restaurants.filter((restaurant) => {
    const queryMatches =
      normalizedQuery.length === 0 ||
      restaurant.name.toLowerCase().includes(normalizedQuery) ||
      restaurant.cuisine.toLowerCase().includes(normalizedQuery) ||
      restaurant.address.toLowerCase().includes(normalizedQuery);
    const categoryMatches =
      !categoryId ||
      categoryId === 'all' ||
      searchDishes('', categoryId).some((dish) => dish.restaurantId === restaurant.id);

    return queryMatches && categoryMatches;
  });
}

export function getCouponOptions(): Coupon[] {
  return coupons;
}
