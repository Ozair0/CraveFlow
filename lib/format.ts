export function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function formatMiles(value: number) {
  return `${value.toFixed(1)} miles`;
}

export function formatMinutesRange(baseMinutes: number) {
  return `${baseMinutes}-${baseMinutes + 5} min`;
}

export function maskCardNumber(last4: string) {
  return `•••• ${last4}`;
}

export function formatGuestLabel(count: number) {
  return `${count} ${count === 1 ? 'guest' : 'guests'}`;
}

export function formatDishRating(rating: number, reviewCount: number) {
  return `${rating.toFixed(1)} (${Math.round(reviewCount / 100) / 10}K)`;
}
