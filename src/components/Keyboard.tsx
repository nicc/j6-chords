import { useState } from 'preact/hooks';
import type { Chord } from '../lib/lookup';
import { KEY_COUNT, WHITE_KEYS, blackKeyBoundary, isBlackKey, notesByKey } from '../lib/music';

const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_KEYS = Array.from({ length: KEY_COUNT }, (_, pc) => pc).filter(isBlackKey);
const WHITE_SHARE = 100 / WHITE_KEYS.length;
const BLACK_WIDTH = 0.6; // of a white key

type Props = { readonly chords: readonly Chord[] | null };

// One octave, C to B. Each key carries the chord the J-6 plays from it. Holding a key
// hides the chord names and lights the keys its notes fall on, labelled with their octave.
export function Keyboard({ chords }: Props) {
  const [held, setHeld] = useState<number | null>(null);
  const heldChord = held === null ? undefined : chords?.[held];
  const voicing = heldChord ? notesByKey(heldChord.notes) : null;

  // A key only ends its own hold. On desktop, pressing a new key blurs the previous one
  // after the new pointerdown; an unconditional release there would cancel the new hold.
  const release = (pc: number) => () => setHeld((h) => (h === pc ? null : h));

  const renderKey = (pc: number) => {
    const black = isBlackKey(pc);
    const notes = voicing?.[pc] ?? [];
    const classes = ['key', black ? 'black' : 'white', notes.length ? 'lit' : '', held === pc ? 'held' : '']
      .filter(Boolean)
      .join(' ');
    const position = black
      ? { left: `${(blackKeyBoundary(pc) - BLACK_WIDTH / 2) * WHITE_SHARE}%`, width: `${BLACK_WIDTH * WHITE_SHARE}%` }
      : undefined;
    const chord = chords?.[pc];
    const end = release(pc);

    return (
      <button
        key={pc}
        type="button"
        class={classes}
        style={position}
        data-key={KEY_NAMES[pc]}
        aria-label={chord ? `${KEY_NAMES[pc]}: ${chord.chord}` : KEY_NAMES[pc]}
        aria-pressed={held === pc}
        disabled={!chords}
        onPointerDown={() => setHeld(pc)}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            setHeld(pc);
          }
        }}
        onKeyUp={end}
        onBlur={end}
      >
        {chord && <span class="chord-name">{chord.chord}</span>}
        {notes.length > 0 && (
          <span class="voicing">
            {notes.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        )}
      </button>
    );
  };

  return (
    <div class={voicing ? 'keyboard holding' : 'keyboard'} onContextMenu={(e) => e.preventDefault()}>
      <div class="whites">{WHITE_KEYS.map(renderKey)}</div>
      {BLACK_KEYS.map(renderKey)}
    </div>
  );
}
