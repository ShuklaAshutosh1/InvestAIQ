import type { Pattern, PatternDirection } from "./types";

/**
 * Walks backward from the most recent price and counts how many
 * consecutive steps moved in the same direction.
 */
export function detectPattern(prices: number[]): Pattern {
  if (prices.length < 2) return { direction: "flat", length: 0 };

  const stepDirection = (a: number, b: number): PatternDirection =>
    b > a ? "up" : b < a ? "down" : "flat";

  const direction = stepDirection(prices[prices.length - 2], prices[prices.length - 1]);
  let length = direction === "flat" ? 0 : 1;

  for (let i = prices.length - 1; i > 0 && direction !== "flat"; i--) {
    if (stepDirection(prices[i - 1], prices[i]) !== direction) break;
    if (i !== prices.length - 1) length++;
  }

  return { direction, length };
}

export function suggestionFor(pattern: Pattern): string {
  if (pattern.direction === "up" && pattern.length >= 3) {
    return `Sustained upward movement observed across ${pattern.length} consecutive price changes. This describes recent data and does not predict what happens next.`;
  }
  if (pattern.direction === "up") {
    return `Short upward move (${pattern.length} point${pattern.length === 1 ? "" : "s"}). Too early to call a trend.`;
  }
  if (pattern.direction === "down" && pattern.length >= 3) {
    return `Sustained downward movement observed across ${pattern.length} consecutive price changes. This describes recent data and does not predict what happens next.`;
  }
  if (pattern.direction === "down") {
    return `Short downward move (${pattern.length} point${pattern.length === 1 ? "" : "s"}). Not yet a clear trend.`;
  }
  return "Price is flat. No clear directional pattern right now.";
}
