import { describe, expect, it } from 'vitest';

import { createInitialAppState } from '../data/mock-data';
import { getCartSummary, searchDishes, searchRestaurants } from '../lib/selectors';

describe('getCartSummary', () => {
  it('calculates seeded cart totals correctly', () => {
    const state = createInitialAppState();
    const summary = getCartSummary(state);

    expect(summary.lineItems).toHaveLength(2);
    expect(summary.subtotal).toBeCloseTo(28.5);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.serviceFee).toBe(1.5);
    expect(summary.discount).toBe(0);
    expect(summary.total).toBeCloseTo(30);
  });

  it('applies percentage discounts when a coupon is active', () => {
    const state = createInitialAppState();
    state.cart.appliedCouponId = 'foodie30';
    const summary = getCartSummary(state);

    expect(summary.appliedCoupon?.code).toBe('FOODIE30');
    expect(summary.discount).toBeCloseTo(4.275);
    expect(summary.total).toBeCloseTo(25.725);
  });
});

describe('catalog search', () => {
  it('finds dishes by keyword and category', () => {
    const pizzaResults = searchDishes('pizza', 'pizza');
    const burgerResults = searchDishes('burger', 'burger');

    expect(pizzaResults.map((dish) => dish.id)).toContain('italia-crisp');
    expect(burgerResults.map((dish) => dish.id)).toContain('firehouse-burger');
  });

  it('finds restaurants by cuisine and related categories', () => {
    const mediterraneanResults = searchRestaurants('mediterranean');
    const pizzaCategoryResults = searchRestaurants('', 'pizza');

    expect(mediterraneanResults.map((restaurant) => restaurant.id)).toContain('savory-spot');
    expect(pizzaCategoryResults.map((restaurant) => restaurant.id)).toContain('brooklyn-bites');
  });
});
