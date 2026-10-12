// Pitch helpers for a one-octave keyboard (index 0 = C ... 11 = B).

export const KEY_COUNT = 12;

const LETTERS: Readonly<Record<string, number>> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACCIDENTALS: Readonly<Record<string, number>> = { '': 0, '#': 1, b: -1 };

const NOTE = /^([A-G])([#b]?)(-?\d+)$/;

// "C#3" -> 1, "Bb2" -> 10. Throws on anything else so bad data fails loudly in tests.
export const pitchClass = (note: string): number => {
  const match = NOTE.exec(note);
  if (!match) throw new Error(`Unrecognised note: ${note}`);
  const [, letter = '', accidental = ''] = match;
  return ((LETTERS[letter]! + ACCIDENTALS[accidental]!) % 12 + 12) % 12;
};

export const isBlackKey = (pc: number): boolean => [1, 3, 6, 8, 10].includes(pc);

// White keys only, in order: their pitch classes.
export const WHITE_KEYS: readonly number[] = [0, 2, 4, 5, 7, 9, 11];

// For a black key, the number of white keys to its left (its centre sits on that boundary).
export const blackKeyBoundary = (pc: number): number => WHITE_KEYS.filter((w) => w < pc).length;

// Group a voicing's notes onto the twelve keys they fall on, keeping their octave spelling.
export const notesByKey = (notes: readonly string[]): readonly (readonly string[])[] =>
  Array.from({ length: KEY_COUNT }, (_, pc) => notes.filter((n) => pitchClass(n) === pc));
