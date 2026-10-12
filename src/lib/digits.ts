// Multi-digit inputs where each digit is stepped on its own.
// Every digit cycles, but only through values that keep the whole number within 0..max.

export type Range = { readonly max: number; readonly width: number };

export const toDigits = (value: number, width: number): readonly number[] =>
  String(value).padStart(width, '0').split('').map(Number);

export const fromDigits = (digits: readonly number[]): number =>
  digits.reduce((acc, d) => acc * 10 + d, 0);

const mod = (n: number, m: number): number => ((n % m) + m) % m;

// Highest value the digit at `index` (0 = most significant) can take, given the digits above it.
// Only constrained when every higher digit already matches the max: with max 100, the tens
// digit of 0xx can be 0-9, but the tens digit of 1xx can only be 0.
export const digitCeiling = (value: number, range: Range, index: number): number => {
  const digits = toDigits(value, range.width);
  const maxDigits = toDigits(range.max, range.width);
  const atMax = digits.slice(0, index).every((d, i) => d === maxDigits[i]);
  return atMax ? (maxDigits[index] ?? 9) : 9;
};

// Step one digit by `delta`, wrapping within its allowed span. If raising a higher digit
// pushes the number past max (e.g. 045 -> 145 with max 100), clamp to max.
export const stepDigit = (value: number, range: Range, index: number, delta: number): number => {
  const span = digitCeiling(value, range, index) + 1;
  const next = toDigits(value, range.width).map((d, i) => (i === index ? mod(d + delta, span) : d));
  return Math.min(fromDigits(next), range.max);
};

// Whole steps covered by a vertical drag. Dragging up (negative dy) increments.
export const swipeSteps = (dy: number, stepPx: number): number => Math.trunc(-dy / stepPx) || 0;
