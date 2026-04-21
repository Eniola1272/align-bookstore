export const FREE_SHIPPING_THRESHOLD = 50000;
export const IBADAN_SHIPPING_COST = 1500;
export const STANDARD_SHIPPING_COST = 3500;

export function isIbadan(city: string) {
  return city.trim().toLowerCase().includes('ibadan');
}

export function calculateShipping(subtotal: number, city: string): number {
  if (isIbadan(city) && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  if (isIbadan(city)) return IBADAN_SHIPPING_COST;
  return STANDARD_SHIPPING_COST;
}

export function shippingLabel(subtotal: number, city: string): string {
  const cost = calculateShipping(subtotal, city);
  return cost === 0 ? 'Free' : `₦${cost.toLocaleString()}`;
}
