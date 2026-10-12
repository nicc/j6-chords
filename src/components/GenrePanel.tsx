import { SET_RANGE, lookupSet } from '../lib/lookup';
import { Keyboard } from './Keyboard';
import { SegmentInput } from './SegmentInput';

type Props = { readonly set: number; readonly onSetChange: (n: number) => void };

export function GenrePanel({ set, onSetChange }: Props) {
  const found = lookupSet(set);
  return (
    <section class="genre" aria-label="Genre">
      <div class="genre-head">
        <SegmentInput label="Genre" value={set} range={SET_RANGE} onChange={onSetChange} />
        <h2 class="genre-name" aria-live="polite">
          {found?.genre}
        </h2>
      </div>
      <p class="genre-desc">{found?.description}</p>
      <Keyboard chords={found?.chords ?? null} />
    </section>
  );
}
