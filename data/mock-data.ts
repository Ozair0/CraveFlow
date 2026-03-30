import type {
  Address,
  AppState,
  Booking,
  Category,
  Coupon,
  Dish,
  NotificationItem,
  Offer,
  OnboardingSlide,
  Order,
  PaymentMethod,
  Restaurant,
  UserProfile,
} from '@/types/app';

const userProfile: UserProfile = {
  name: 'Julia Morris',
  email: 'julia@craveflow.app',
  phone: '+1 (212) 555-0182',
  locationLabel: 'New York, USA',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'discover',
    title: 'Order Delicious Food Anytime, Anywhere',
    accent: 'Food Anytime, Anywhere',
    description:
      'Browse curated menus, save your favourites, and get fresh meals delivered fast.',
    preview: 'home',
  },
  {
    id: 'save',
    title: 'Save Your Favorite Dishes & Restaurants',
    accent: 'Favorite Dishes & Restaurants',
    description:
      'Keep your most-loved meals close and reorder the best bites in just a tap.',
    preview: 'favorites',
  },
  {
    id: 'track',
    title: 'Track Your Delivery in Real Time',
    accent: 'Track Your Delivery',
    description:
      'Follow every stop, see live ETA updates, and stay in sync with your courier.',
    preview: 'tracking',
  },
];

export const categories: Category[] = [
  { id: 'burger', label: 'Burger', icon: 'fast-food-outline', accent: '#FF7A1A' },
  { id: 'pizza', label: 'Pizza', icon: 'pizza-outline', accent: '#FFB800' },
  { id: 'noodles', label: 'Noodles', icon: 'restaurant-outline', accent: '#8F60FF' },
  { id: 'dessert', label: 'Dessert', icon: 'ice-cream-outline', accent: '#FF5FA2' },
  { id: 'salad', label: 'Healthy', icon: 'leaf-outline', accent: '#2BB673' },
];

export const offers: Offer[] = [
  {
    id: 'weekend',
    title: 'Weekend Offers!',
    subtitle: 'Get Special Offers Up to 30% Off',
    discountLabel: 'Up to 30%',
    ctaLabel: 'Get Now',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'lunch',
    title: 'Lunch Rush',
    subtitle: 'Free delivery on orders above $20',
    discountLabel: 'Free Delivery',
    ctaLabel: 'Order Lunch',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'late-night',
    title: 'Late Night Cravings',
    subtitle: 'Enjoy handcrafted meals till midnight',
    discountLabel: 'Open Late',
    ctaLabel: 'Browse',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
];

export const restaurants: Restaurant[] = [
  {
    id: 'brooklyn-bites',
    name: 'Brooklyn Bites',
    cuisine: 'Italian',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 1200,
    distanceMiles: 1.5,
    deliveryTimeMinutes: 15,
    deliveryFeeLabel: 'Free Delivery',
    address: '789 Park Avenue, New York, NY',
    description:
      'Wood-fired pizzas, fresh pasta, and a lively dine-in room inspired by downtown Brooklyn.',
    featuredDishIds: ['italia-crisp', 'veggie-pasta'],
    bookingAvailable: true,
  },
  {
    id: 'savory-spot',
    name: 'The Savory Spot',
    cuisine: 'Mediterranean',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 860,
    distanceMiles: 1.2,
    deliveryTimeMinutes: 18,
    deliveryFeeLabel: 'Free Delivery',
    address: '8502 Preston Rd, Inglewood, NY',
    description:
      'Bright Mediterranean plates, warm service, and one of the best terrace bookings in town.',
    featuredDishIds: ['mediterranean-bowl', 'loaded-fries'],
    bookingAvailable: true,
  },
  {
    id: 'taco-trail',
    name: 'Taco Trail',
    cuisine: 'Mexican',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 980,
    distanceMiles: 2.1,
    deliveryTimeMinutes: 21,
    deliveryFeeLabel: '$2.99 Delivery',
    address: '240 Mulberry Street, New York, NY',
    description:
      'Street-style tacos, grilled corn, and a fast pickup lane for busy weeknights.',
    featuredDishIds: ['mexican-tacos', 'churro-bites'],
    bookingAvailable: false,
  },
  {
    id: 'grill-lab',
    name: 'Grill Lab',
    cuisine: 'American',
    image:
      'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 620,
    distanceMiles: 2.8,
    deliveryTimeMinutes: 24,
    deliveryFeeLabel: '$1.99 Delivery',
    address: '14 Stone Street, New York, NY',
    description:
      'Loaded burgers, crispy sides, and comfort food combos made for game night.',
    featuredDishIds: ['firehouse-burger', 'loaded-fries'],
    bookingAvailable: false,
  },
];

export const dishes: Dish[] = [
  {
    id: 'italia-crisp',
    restaurantId: 'brooklyn-bites',
    name: 'ItaliaCrisp Pizza',
    shortDescription: 'Stone-baked pizza with olives, peppers, and pepperoni.',
    description:
      'A signature stone-baked pizza layered with mozzarella, roasted peppers, black olives, and pepperoni over a tangy San Marzano sauce.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'Italian',
    rating: 4.8,
    reviewCount: 1200,
    cookTimeMinutes: 10,
    spicyLevel: 'Mild',
    offerLabel: '20% OFF',
    sizes: [
      { id: 'small', label: 'Small', inches: 8, price: 12 },
      { id: 'regular', label: 'Regular', inches: 10, price: 14 },
      { id: 'large', label: 'Large', inches: 12, price: 16 },
      { id: 'xlarge', label: 'Extra Large', inches: 14, price: 18 },
    ],
    addOns: [
      { id: 'extra-cheese', label: 'Extra Cheese', price: 2 },
      { id: 'mushrooms', label: 'Mushrooms', price: 1.5 },
      { id: 'olives', label: 'Olives', price: 1.25 },
    ],
    categoryIds: ['pizza'],
    calories: 680,
    isVegetarian: false,
    isPopular: true,
  },
  {
    id: 'mexican-tacos',
    restaurantId: 'taco-trail',
    name: 'Mexican Tacos',
    shortDescription: 'Three crunchy tacos with salsa verde and grilled steak.',
    description:
      'Crisp taco shells packed with marinated steak, pico de gallo, shredded lettuce, and a bright salsa verde finish.',
    image:
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'Mexican',
    rating: 4.7,
    reviewCount: 940,
    cookTimeMinutes: 12,
    spicyLevel: 'Hot',
    offerLabel: '15% OFF',
    sizes: [
      { id: 'single', label: 'Single', inches: 0, price: 8 },
      { id: 'double', label: 'Double', inches: 0, price: 14 },
      { id: 'family', label: 'Family', inches: 0, price: 22 },
    ],
    addOns: [
      { id: 'guac', label: 'Fresh Guac', price: 2.25 },
      { id: 'jalapeno', label: 'Jalapenos', price: 1 },
      { id: 'lime', label: 'Lime Crema', price: 1.75 },
    ],
    categoryIds: ['burger'],
    calories: 490,
    isVegetarian: false,
    isPopular: true,
  },
  {
    id: 'loaded-fries',
    restaurantId: 'grill-lab',
    name: 'Crispy French Fries',
    shortDescription: 'Golden fries with smoky seasoning and garlic aioli.',
    description:
      'Double-fried potato sticks finished with smoky paprika salt and served with a velvety garlic aioli.',
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'American',
    rating: 4.9,
    reviewCount: 790,
    cookTimeMinutes: 8,
    spicyLevel: 'Mild',
    offerLabel: '5% OFF',
    sizes: [
      { id: 'small', label: 'Snack', inches: 0, price: 6 },
      { id: 'regular', label: 'Regular', inches: 0, price: 10 },
      { id: 'large', label: 'Share', inches: 0, price: 14 },
    ],
    addOns: [
      { id: 'aioli', label: 'Garlic Aioli', price: 1.5 },
      { id: 'truffle', label: 'Truffle Dust', price: 2 },
      { id: 'parmesan', label: 'Parmesan', price: 1.25 },
    ],
    categoryIds: ['burger'],
    calories: 410,
    isVegetarian: true,
    isPopular: true,
  },
  {
    id: 'veggie-pasta',
    restaurantId: 'brooklyn-bites',
    name: 'Veggie Pasta',
    shortDescription: 'Fresh penne tossed with basil pesto and seasonal greens.',
    description:
      'Penne pasta coated in bright basil pesto with zucchini ribbons, cherry tomatoes, and parmesan.',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'Italian',
    rating: 4.6,
    reviewCount: 640,
    cookTimeMinutes: 15,
    spicyLevel: 'Medium',
    offerLabel: '10% OFF',
    sizes: [
      { id: 'regular', label: 'Regular', inches: 0, price: 14 },
      { id: 'large', label: 'Large', inches: 0, price: 18 },
    ],
    addOns: [
      { id: 'pesto', label: 'Extra Pesto', price: 2 },
      { id: 'burrata', label: 'Burrata', price: 3 },
      { id: 'chili', label: 'Chili Oil', price: 1.25 },
    ],
    categoryIds: ['noodles', 'salad'],
    calories: 550,
    isVegetarian: true,
    isPopular: false,
  },
  {
    id: 'firehouse-burger',
    restaurantId: 'grill-lab',
    name: 'Firehouse Burger',
    shortDescription: 'Juicy burger stacked with cheddar, onion jam, and pickles.',
    description:
      'A flame-grilled burger with melted cheddar, caramelized onion jam, crunchy pickles, and smoky house sauce.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'American',
    rating: 4.5,
    reviewCount: 520,
    cookTimeMinutes: 14,
    spicyLevel: 'Medium',
    offerLabel: 'Chef Pick',
    sizes: [
      { id: 'single', label: 'Single', inches: 0, price: 13 },
      { id: 'double', label: 'Double', inches: 0, price: 17 },
    ],
    addOns: [
      { id: 'bacon', label: 'Bacon', price: 2.5 },
      { id: 'egg', label: 'Fried Egg', price: 1.5 },
      { id: 'jalapenos', label: 'Jalapenos', price: 1.25 },
    ],
    categoryIds: ['burger'],
    calories: 730,
    isVegetarian: false,
    isPopular: true,
  },
  {
    id: 'mediterranean-bowl',
    restaurantId: 'savory-spot',
    name: 'Mediterranean Bowl',
    shortDescription: 'Falafel bowl with lemon rice, hummus, and crisp salad.',
    description:
      'A hearty bowl with herbed rice, falafel, hummus, cucumber salad, and pomegranate molasses.',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'Mediterranean',
    rating: 4.7,
    reviewCount: 480,
    cookTimeMinutes: 11,
    spicyLevel: 'Mild',
    offerLabel: 'Healthy',
    sizes: [
      { id: 'regular', label: 'Regular', inches: 0, price: 15 },
      { id: 'large', label: 'Large', inches: 0, price: 19 },
    ],
    addOns: [
      { id: 'falafel', label: 'Extra Falafel', price: 2 },
      { id: 'feta', label: 'Feta', price: 1.5 },
      { id: 'avocado', label: 'Avocado', price: 2.25 },
    ],
    categoryIds: ['salad'],
    calories: 510,
    isVegetarian: true,
    isPopular: true,
  },
  {
    id: 'churro-bites',
    restaurantId: 'taco-trail',
    name: 'Churro Bites',
    shortDescription: 'Warm cinnamon churros with dulce de leche dip.',
    description:
      'Golden mini churros dusted in cinnamon sugar, served warm with silky dulce de leche.',
    image:
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1200&q=80',
    ],
    cuisine: 'Dessert',
    rating: 4.9,
    reviewCount: 320,
    cookTimeMinutes: 7,
    spicyLevel: 'Mild',
    sizes: [
      { id: 'box', label: '6 Pieces', inches: 0, price: 7 },
      { id: 'party', label: '12 Pieces', inches: 0, price: 12 },
    ],
    addOns: [
      { id: 'chocolate', label: 'Chocolate Dip', price: 1.5 },
      { id: 'strawberry', label: 'Berry Sauce', price: 1.25 },
    ],
    categoryIds: ['dessert'],
    calories: 350,
    isVegetarian: true,
    isPopular: false,
  },
];

export const coupons: Coupon[] = [
  {
    id: 'foodie30',
    code: 'FOODIE30',
    title: 'Enjoy 30% OFF on all orders',
    description: 'Add items worth $12 more to unlock this reward.',
    accent: '#FF6720',
    minimumSpend: 32,
    progressText: 'Add items worth $12 more to unlock',
    expiryText: 'Ends in 1 day',
  },
  {
    id: 'snack25',
    code: 'SNACK25',
    title: 'Get 25% OFF on snacks',
    description: 'Perfect for fries, churros, and quick cravings.',
    accent: '#61C37C',
    minimumSpend: 22,
    progressText: 'Add items worth $22 more to unlock',
    expiryText: 'Ends in 2 days',
  },
  {
    id: 'quickeats',
    code: 'QUICKEATS',
    title: 'Flat 15% OFF on fast food',
    description: 'Use on burgers, fries, and combo meals.',
    accent: '#7856FF',
    minimumSpend: 24,
    progressText: 'Add items worth $24 more to unlock',
    expiryText: 'Ends in 4 days',
  },
  {
    id: 'weekend',
    code: 'WEEKEND',
    title: 'Flat 25% OFF on weekend orders',
    description: 'Stack this on larger carts for the biggest savings.',
    accent: '#C58A2F',
    minimumSpend: 28,
    progressText: 'Add items worth $24 more to unlock',
    expiryText: 'Ends in 6 days',
  },
];

const notificationsSeed: NotificationItem[] = [
  {
    id: 'order-way',
    title: 'Order On The Way',
    body: 'Charlotte picked up your meal and is heading your way right now.',
    icon: 'bicycle-outline',
    timeLabel: '1h',
    isNew: true,
    group: 'today',
  },
  {
    id: 'discount',
    title: 'Discount Coupons Available',
    body: 'Use FOODIE30 before midnight to save on your next order.',
    icon: 'pricetag-outline',
    timeLabel: '1h',
    isNew: true,
    group: 'today',
  },
  {
    id: 'rate-order',
    title: 'Rate Your Order',
    body: 'Tell us how the ItaliaCrisp Pizza tasted and help others choose.',
    icon: 'star-outline',
    timeLabel: '3h',
    isNew: false,
    group: 'today',
  },
  {
    id: 'booking-success',
    title: 'Table Booked Successfully!',
    body: 'Your Friday evening booking at Brooklyn Bites is confirmed.',
    icon: 'calendar-outline',
    timeLabel: '1d',
    isNew: false,
    group: 'yesterday',
  },
  {
    id: 'wallet-added',
    title: 'New Payment Method Added',
    body: 'Your ending in 4242 card is now ready for faster checkout.',
    icon: 'card-outline',
    timeLabel: '1d',
    isNew: false,
    group: 'yesterday',
  },
  {
    id: 'delivered',
    title: 'Order Delivered',
    body: 'Your Taco Trail order was delivered successfully. Enjoy!',
    icon: 'checkmark-done-outline',
    timeLabel: '1d',
    isNew: false,
    group: 'yesterday',
  },
];

const ordersSeed: Order[] = [
  {
    id: '#FD785462',
    restaurantId: 'brooklyn-bites',
    restaurantName: 'Brooklyn Bites',
    status: 'active',
    items: [
      {
        dishId: 'italia-crisp',
        name: 'ItaliaCrisp Pizza',
        image:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
        sizeId: 'small',
        sizeLabel: 'Small',
        quantity: 1,
        unitPrice: 12,
        addOnIds: ['extra-cheese'],
        addOnLabel: 'Extra Cheese',
      },
    ],
    subtotal: 14,
    deliveryFee: 0,
    serviceFee: 1,
    discountAmount: 2,
    total: 13,
    etaLabel: '07:55 PM - 08:00 PM',
    placedAtLabel: 'Today, 7:31 PM',
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
        label: 'Brooklyn Bites',
        address: '789 Park Avenue, New York, NY',
        complete: true,
      },
      {
        id: 'dropoff',
        label: 'Home',
        address: '8502 Preston Rd, Inglewood, NY',
        complete: false,
      },
    ],
  },
  {
    id: '#FD569874',
    restaurantId: 'taco-trail',
    restaurantName: 'Taco Trail',
    status: 'completed',
    items: [
      {
        dishId: 'mexican-tacos',
        name: 'Mexican Tacos',
        image:
          'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80',
        sizeId: 'family',
        sizeLabel: '2 Tacos',
        quantity: 1,
        unitPrice: 22,
        addOnIds: [],
        addOnLabel: 'No extras',
      },
    ],
    subtotal: 22,
    deliveryFee: 2.99,
    serviceFee: 1.5,
    discountAmount: 0,
    total: 26.49,
    etaLabel: 'Delivered in 21 min',
    placedAtLabel: 'Mar 28, 6:10 PM',
    activeBadgeLabel: 'Delivered',
    courier: {
      name: 'Miles Johnson',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      phone: '+1 (212) 555-0190',
      vehicle: 'Bike',
    },
    trackingStops: [],
  },
  {
    id: '#FD438112',
    restaurantId: 'grill-lab',
    restaurantName: 'Grill Lab',
    status: 'cancelled',
    items: [
      {
        dishId: 'loaded-fries',
        name: 'Crispy French Fries',
        image:
          'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
        sizeId: 'large',
        sizeLabel: 'Share',
        quantity: 1,
        unitPrice: 14,
        addOnIds: ['truffle'],
        addOnLabel: 'Truffle Dust',
      },
    ],
    subtotal: 16,
    deliveryFee: 1.99,
    serviceFee: 1.2,
    discountAmount: 0,
    total: 19.19,
    etaLabel: 'Cancelled by user',
    placedAtLabel: 'Mar 25, 9:15 PM',
    activeBadgeLabel: 'Cancelled',
    courier: {
      name: 'Leo Parker',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      phone: '+1 (212) 555-0121',
      vehicle: 'Bike',
    },
    trackingStops: [],
  },
];

const bookingsSeed: Booking[] = [
  {
    id: '#RSV8475',
    restaurantId: 'brooklyn-bites',
    restaurantName: 'Brooklyn Bites',
    status: 'upcoming',
    reminderEnabled: true,
    guests: 2,
    bookingDateLabel: 'April 15, 2026 · 07:30 PM',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    address: '789 Park Avenue, New York, NY',
    distanceLabel: '15 min · 3.5 miles',
  },
  {
    id: '#RSV7855',
    restaurantId: 'savory-spot',
    restaurantName: 'The Savory Spot',
    status: 'upcoming',
    reminderEnabled: true,
    guests: 4,
    bookingDateLabel: 'April 22, 2026 · 08:30 PM',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    address: '8502 Preston Rd, Inglewood, NY',
    distanceLabel: '18 min · 4.2 miles',
  },
  {
    id: '#RSV4121',
    restaurantId: 'taco-trail',
    restaurantName: 'Taco Trail',
    status: 'completed',
    reminderEnabled: false,
    guests: 3,
    bookingDateLabel: 'March 19, 2026 · 06:30 PM',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    address: '240 Mulberry Street, New York, NY',
    distanceLabel: '20 min · 5.1 miles',
  },
];

const addressesSeed: Address[] = [
  {
    id: 'home',
    label: 'Home',
    line1: '8502 Preston Rd',
    city: 'Inglewood, NY',
    isDefault: true,
  },
  {
    id: 'office',
    label: 'Office',
    line1: '102 Madison Ave',
    city: 'New York, NY',
    isDefault: false,
  },
];

const paymentMethodsSeed: PaymentMethod[] = [
  {
    id: 'visa-4242',
    label: 'Personal Visa',
    brand: 'Visa',
    last4: '4242',
    isDefault: true,
  },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    brand: 'Apple Pay',
    last4: '0000',
    isDefault: false,
  },
];

export function createInitialAppState(): AppState {
  return {
    session: {
      hasSeenOnboarding: false,
      isAuthenticated: false,
      user: userProfile,
    },
    settings: {
      themeMode: 'system',
      pushNotifications: true,
      emailNotifications: true,
      locationEnabled: true,
    },
    favorites: {
      dishIds: ['italia-crisp', 'mexican-tacos', 'loaded-fries'],
      restaurantIds: ['brooklyn-bites', 'savory-spot'],
    },
    cart: {
      items: [
        { id: 'cart-1', dishId: 'italia-crisp', sizeId: 'small', quantity: 1, addOnIds: [] },
        {
          id: 'cart-2',
          dishId: 'mediterranean-bowl',
          sizeId: 'regular',
          quantity: 1,
          addOnIds: ['feta'],
        },
      ],
    },
    notifications: notificationsSeed,
    orders: ordersSeed,
    bookings: bookingsSeed,
    addresses: addressesSeed,
    paymentMethods: paymentMethodsSeed,
  };
}

export function getRestaurantById(restaurantId: string) {
  return restaurants.find((restaurant) => restaurant.id === restaurantId);
}

export function getDishById(dishId: string) {
  return dishes.find((dish) => dish.id === dishId);
}

export function getCouponByCode(code: string) {
  return coupons.find((coupon) => coupon.code.toLowerCase() === code.trim().toLowerCase());
}

export function getCouponById(couponId?: string) {
  return coupons.find((coupon) => coupon.id === couponId);
}
