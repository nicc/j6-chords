import { describe, expect, it } from 'vitest';
import { CHORD_SETS, GENRES, LEGEND, STYLES, lookupSet, phrasingText } from '../src/lib/lookup';
import { pitchClass } from '../src/lib/music';

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

describe('reference data shape', () => {
  it('has sets 1-100, each with 12 chords in key order', () => {
    expect(CHORD_SETS.map((s) => s.set)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
    for (const s of CHORD_SETS) expect(s.chords.map((c) => c.key)).toEqual(KEYS);
  });
  it('has 2-4 parseable notes per chord', () => {
    for (const c of CHORD_SETS.flatMap((s) => s.chords)) {
      expect(c.notes.length).toBeGreaterThanOrEqual(2);
      expect(c.notes.length).toBeLessThanOrEqual(4);
      c.notes.forEach((n) => expect(() => pitchClass(n)).not.toThrow());
    }
  });
  it('assigns every set to exactly one genre', () => {
    const covered = GENRES.flatMap((g) => g.sets).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });
  it('has styles 1-9 with 12 variations or none', () => {
    expect(STYLES.map((s) => s.style)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const s of STYLES) expect(s.variations === null || s.variations.length === 12).toBe(true);
    expect(Object.keys(LEGEND).length).toBeGreaterThan(0);
  });
});

describe('lookupSet', () => {
  it('returns nothing for 0', () => {
    expect(lookupSet(0)).toBeNull();
  });
  it('returns genre, description and chords for a set', () => {
    const r = lookupSet(1)!;
    expect(r.genre).toBe('Pop');
    expect(r.description).toMatch(/Bright/);
    expect(r.chords[0]!.chord).toBe('Cadd9');
  });
  it('joins genres by set number even where labels differ', () => {
    expect(lookupSet(76)?.genre).toBe('Neo Soul');
  });
  it('covers set 100', () => {
    expect(lookupSet(100)).not.toBeNull();
  });
});

describe('phrasingText', () => {
  it('returns nothing until a style is selected', () => {
    expect(phrasingText(0, 0)).toBeNull();
    expect(phrasingText(0, 5)).toBeNull();
  });
  it('shows category and name as soon as a style is selected', () => {
    expect(phrasingText(2, 0)).toBe('Arp 16ths');
  });
  it('adds the variation once selected', () => {
    expect(phrasingText(2, 1)).toBe('Arp 16ths up 1');
    expect(phrasingText(4, 12)).toBe("Beat pattern '_ooo' (16th)");
  });
  it('omits the variation for styles without a list', () => {
    expect(phrasingText(6, 0)).toBe('Phrased chords (simple)');
    expect(phrasingText(6, 7)).toBe('Phrased chords (simple)');
  });
});
