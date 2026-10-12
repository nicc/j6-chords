import { describe, expect, it } from 'vitest';
import { blackKeyBoundary, isBlackKey, notesByKey, pitchClass } from '../src/lib/music';

describe('pitchClass', () => {
  it('reads naturals, sharps and flats', () => {
    expect(pitchClass('C3')).toBe(0);
    expect(pitchClass('C#3')).toBe(1);
    expect(pitchClass('Db4')).toBe(1);
    expect(pitchClass('Bb2')).toBe(10);
    expect(pitchClass('B5')).toBe(11);
  });
  it('rejects malformed notes', () => {
    expect(() => pitchClass('H3')).toThrow();
    expect(() => pitchClass('C')).toThrow();
  });
});

describe('keyboard layout', () => {
  it('knows black keys', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(isBlackKey)).toEqual([1, 3, 6, 8, 10]);
  });
  it('places black keys on white-key boundaries', () => {
    expect([1, 3, 6, 8, 10].map(blackKeyBoundary)).toEqual([1, 2, 4, 5, 6]);
  });
});

describe('notesByKey', () => {
  it('puts each note on its key with its octave', () => {
    const keys = notesByKey(['C3', 'E3', 'B3', 'D4']);
    expect(keys[0]).toEqual(['C3']);
    expect(keys[2]).toEqual(['D4']);
    expect(keys[4]).toEqual(['E3']);
    expect(keys[11]).toEqual(['B3']);
    expect(keys.filter((k) => k.length > 0)).toHaveLength(4);
  });
  it('stacks octaves that land on the same key', () => {
    expect(notesByKey(['C4', 'C5'])[0]).toEqual(['C4', 'C5']);
  });
});
