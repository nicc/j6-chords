import chordSetsJson from '../../docs/ref/chord-sets.json';
import genresJson from '../../docs/ref/genres.json';
import stylesJson from '../../docs/ref/styles.json';
import type { Range } from './digits';

export type Chord = { readonly key: string; readonly chord: string; readonly notes: readonly string[] };
export type ChordSet = { readonly set: number; readonly chords: readonly Chord[] };
export type Genre = { readonly genre: string; readonly description: string; readonly sets: readonly number[] };
export type Style = {
  readonly style: number;
  readonly category: string;
  readonly name: string;
  readonly variations: readonly string[] | null;
};
export type Legend = Readonly<Record<string, string>>;

export const CHORD_SETS: readonly ChordSet[] = chordSetsJson;
export const GENRES: readonly Genre[] = genresJson.genres;
export const STYLES: readonly Style[] = stylesJson.styles;
export const LEGEND: Legend = stylesJson.legend;

// What the UI calls "genre" is the chord set number; a genre label covers several sets.
export const SET_RANGE: Range = { max: 100, width: 3 };
export const STYLE_RANGE: Range = { max: 9, width: 1 };
export const VARIATION_RANGE: Range = { max: 12, width: 2 };

export type SetLookup = { readonly genre: string; readonly description: string; readonly chords: readonly Chord[] };

// Genres are joined by set number, not label: chord-sets.json and genres.json spell some labels differently.
export const lookupSet = (n: number): SetLookup | null => {
  const set = CHORD_SETS.find((s) => s.set === n);
  const genre = GENRES.find((g) => g.sets.includes(n));
  return set && genre ? { genre: genre.genre, description: genre.description, chords: set.chords } : null;
};

// "Category name variation", with the variation only once one is selected and the style has it.
export const phrasingText = (style: number, variation: number): string | null => {
  const s = STYLES.find((x) => x.style === style);
  if (!s) return null;
  const v = variation > 0 ? s.variations?.[variation - 1] : undefined;
  return [s.category, s.name, v].filter(Boolean).join(' ');
};
