export function averagePrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  const total = prices.reduce((sum, price) => sum + price, 0);
  return total / prices.length;
}

export function volatility(prices: number[]): number {
  if (prices.length === 0) return 0;
  return Math.max(...prices) - Math.min(...prices);
}
