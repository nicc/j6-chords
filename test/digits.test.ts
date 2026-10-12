import { describe, expect, it } from 'vitest';
import { digitCeiling, fromDigits, stepDigit, swipeSteps, toDigits } from '../src/lib/digits';

const SET = { max: 100, width: 3 };
const VAR = { max: 12, width: 2 };
const STYLE = { max: 9, width: 1 };

describe('toDigits / fromDigits', () => {
  it('pads to width and round-trips', () => {
    expect(toDigits(7, 3)).toEqual([0, 0, 7]);
    expect(fromDigits(toDigits(45, 3))).toBe(45);
  });
});

describe('digitCeiling', () => {
  it('limits the leading digit to the max leading digit', () => {
    expect(digitCeiling(45, SET, 0)).toBe(1);
    expect(digitCeiling(5, VAR, 0)).toBe(1);
  });
  it('frees lower digits while a higher digit is below max', () => {
    expect(digitCeiling(45, SET, 1)).toBe(9);
    expect(digitCeiling(5, VAR, 1)).toBe(9);
  });
  it('pins lower digits once the higher digits reach max', () => {
    expect(digitCeiling(100, SET, 1)).toBe(0);
    expect(digitCeiling(100, SET, 2)).toBe(0);
    expect(digitCeiling(10, VAR, 1)).toBe(2);
  });
});

describe('stepDigit', () => {
  it('increments and decrements a single digit', () => {
    expect(stepDigit(45, SET, 2, 1)).toBe(46);
    expect(stepDigit(45, SET, 1, -1)).toBe(35);
  });
  it('wraps 9 -> 0 and 0 -> 9 without carrying', () => {
    expect(stepDigit(49, SET, 2, 1)).toBe(40);
    expect(stepDigit(40, SET, 2, -1)).toBe(49);
    expect(stepDigit(0, STYLE, 0, -1)).toBe(9);
    expect(stepDigit(9, STYLE, 0, 1)).toBe(0);
  });
  it('cycles the leading digit through its allowed span only', () => {
    expect(stepDigit(0, SET, 0, 1)).toBe(100);
    expect(stepDigit(100, SET, 0, 1)).toBe(0);
    expect(stepDigit(0, SET, 0, -1)).toBe(100);
  });
  it('clamps to max when a higher digit would overshoot', () => {
    expect(stepDigit(45, SET, 0, 1)).toBe(100);
    expect(stepDigit(5, VAR, 0, 1)).toBe(12);
  });
  it('keeps pinned digits fixed', () => {
    expect(stepDigit(100, SET, 1, 1)).toBe(100);
    expect(stepDigit(100, SET, 2, -1)).toBe(100);
  });
  it('cycles a partially constrained digit within its span', () => {
    expect(stepDigit(12, VAR, 1, 1)).toBe(10);
    expect(stepDigit(10, VAR, 1, -1)).toBe(12);
  });
  it('never produces a value outside 0..max', () => {
    for (const range of [SET, VAR, STYLE]) {
      for (let v = 0; v <= range.max; v++) {
        for (let i = 0; i < range.width; i++) {
          for (const d of [-3, -1, 1, 3]) {
            const next = stepDigit(v, range, i, d);
            expect(next).toBeGreaterThanOrEqual(0);
            expect(next).toBeLessThanOrEqual(range.max);
          }
        }
      }
    }
  });
});

describe('swipeSteps', () => {
  it('counts whole steps, up is positive', () => {
    expect(swipeSteps(-10, 24)).toBe(0);
    expect(swipeSteps(-24, 24)).toBe(1);
    expect(swipeSteps(-50, 24)).toBe(2);
    expect(swipeSteps(30, 24)).toBe(-1);
  });
});
