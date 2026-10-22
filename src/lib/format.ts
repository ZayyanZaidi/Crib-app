// 8500000 -> "Rs 85 lakh", 25000000 -> "Rs 2.5 crore"
export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `Rs ${Number((price / 10000000).toFixed(2))} crore`;
  }
  return `Rs ${Number((price / 100000).toFixed(2))} lakh`;
}
