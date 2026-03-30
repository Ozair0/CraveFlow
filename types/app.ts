export type ThemeMode = 'system' | 'light' | 'dark';

export type CuisineType =
  | 'Italian'
  | 'Mexican'
  | 'American'
  | 'Japanese'
  | 'Mediterranean'
  | 'Dessert';

export type OrderStatus = 'active' | 'completed' | 'cancelled';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type NotificationGroup = 'today' | 'yesterday' | 'earlier';

export type Category = {
  id: string;
  label: string;
  icon: string;
  accent: string;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  discountLabel: string;
  ctaLabel: string;
  image: string;
};

export type OnboardingSlide = {
  id: string;
  title: string;
  accent: string;
  description: string;
  preview: 'home' | 'favorites' | 'tracking';
};

export type AddOn = {
  id: string;
  label: string;
  price: number;
};

export type SizeOption = {
  id: string;
  label: string;
  inches: number;
  price: number;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: CuisineType;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  deliveryTimeMinutes: number;
  deliveryFeeLabel: string;
  address: string;
  description: string;
  featuredDishIds: string[];
  bookingAvailable: boolean;
};

export type Dish = {
  id: string;
  restaurantId: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  cuisine: CuisineType;
  rating: number;
  reviewCount: number;
  cookTimeMinutes: number;
  spicyLevel: 'Mild' | 'Medium' | 'Hot';
  offerLabel?: string;
  sizes: SizeOption[];
  addOns: AddOn[];
  categoryIds: string[];
  calories: number;
  isVegetarian: boolean;
  isPopular: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  accent: string;
  minimumSpend: number;
  progressText: string;
  expiryText: string;
};

export type Courier = {
  name: string;
  avatar: string;
  phone: string;
  vehicle: string;
};

export type TrackingStop = {
  id: string;
  label: string;
  address: string;
  complete: boolean;
};

export type OrderItemSnapshot = {
  dishId: string;
  name: string;
  image: string;
  sizeId: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  addOnIds: string[];
  addOnLabel: string;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  total: number;
  etaLabel: string;
  placedAtLabel: string;
  activeBadgeLabel: string;
  courier: Courier;
  trackingStops: TrackingStop[];
};

export type Booking = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  status: BookingStatus;
  reminderEnabled: boolean;
  guests: number;
  bookingDateLabel: string;
  image: string;
  address: string;
  distanceLabel: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  icon: string;
  timeLabel: string;
  isNew: boolean;
  group: NotificationGroup;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  label: string;
  brand: 'Visa' | 'Mastercard' | 'Apple Pay';
  last4: string;
  isDefault: boolean;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  locationLabel: string;
  avatar: string;
};

export type CartItem = {
  id: string;
  dishId: string;
  sizeId: string;
  quantity: number;
  addOnIds: string[];
};

export type SettingsState = {
  themeMode: ThemeMode;
  pushNotifications: boolean;
  emailNotifications: boolean;
  locationEnabled: boolean;
};

export type SessionState = {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  user: UserProfile;
};

export type FavoritesState = {
  dishIds: string[];
  restaurantIds: string[];
};

export type CartState = {
  items: CartItem[];
  appliedCouponId?: string;
};

export type AppState = {
  session: SessionState;
  settings: SettingsState;
  favorites: FavoritesState;
  cart: CartState;
  notifications: NotificationItem[];
  orders: Order[];
  bookings: Booking[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
};

export type CheckoutPayload = {
  addressId: string;
  paymentMethodId: string;
};

export type ReservationPayload = {
  restaurantId: string;
  bookingDateLabel: string;
  guests: number;
};
