import { useRef } from 'preact/hooks';
import { digitCeiling, stepDigit, swipeSteps, toDigits, type Range } from '../lib/digits';
import { SevenSegment } from './SevenSegment';

const STEP_PX = 22;
const PLACES = ['ones', 'tens', 'hundreds'];

type Props = {
  readonly label: string;
  readonly value: number;
  readonly range: Range;
  readonly onChange: (value: number) => void;
};

function Triangle({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 16 10" aria-hidden="true">
      <polygon points={up ? '8,0 16,10 0,10' : '0,0 16,0 8,10'} />
    </svg>
  );
}

// A vertical drag over a digit steps it once per STEP_PX, and keeps stepping as the finger keeps moving.
function useSwipe(onSteps: (steps: number) => void) {
  const drag = useRef<{ y: number; applied: number } | null>(null);
  const end = () => {
    drag.current = null;
  };
  return {
    onPointerDown: (e: PointerEvent) => {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      drag.current = { y: e.clientY, applied: 0 };
    },
    onPointerMove: (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const steps = swipeSteps(e.clientY - d.y, STEP_PX);
      if (steps !== d.applied) {
        onSteps(steps - d.applied);
        d.applied = steps;
      }
    },
    onPointerUp: end,
    onPointerCancel: end,
  };
}

type ColumnProps = Props & { readonly index: number };

function DigitColumn({ label, value, range, onChange, index }: ColumnProps) {
  const digit = toDigits(value, range.width)[index] ?? 0;
  const ceiling = digitCeiling(value, range, index);
  const place = PLACES[range.width - 1 - index] ?? '';
  const name = range.width > 1 ? `${label} ${place}` : label;
  const step = (delta: number) => onChange(stepDigit(value, range, index, delta));
  const swipe = useSwipe(step);
  const column = index + 1;

  return (
    <>
      <button
        type="button"
        class="nudge"
        style={{ gridRow: 1, gridColumn: column }}
        aria-label={`${name} up`}
        disabled={ceiling === 0}
        onClick={() => step(1)}
      >
        <Triangle up />
      </button>
      <div
        class="digit-face"
        style={{ gridRow: 2, gridColumn: column }}
        role="spinbutton"
        tabIndex={0}
        aria-label={name}
        aria-valuenow={digit}
        aria-valuemin={0}
        aria-valuemax={ceiling}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') step(1);
          else if (e.key === 'ArrowDown') step(-1);
          else return;
          e.preventDefault();
        }}
        {...swipe}
      >
        <SevenSegment digit={digit} />
      </div>
      <button
        type="button"
        class="nudge"
        style={{ gridRow: 3, gridColumn: column }}
        aria-label={`${name} down`}
        disabled={ceiling === 0}
        onClick={() => step(-1)}
      >
        <Triangle up={false} />
      </button>
    </>
  );
}

export function SegmentInput(props: Props) {
  const columns = Array.from({ length: props.range.width }, (_, i) => i);
  return (
    <div class="segment-field">
      <div class="bracket">{props.label}</div>
      <div class="segment-input" style={{ '--digits': props.range.width }} data-value={props.value}>
        <div class="led-window" aria-hidden="true" />
        {columns.map((i) => (
          <DigitColumn key={i} {...props} index={i} />
        ))}
      </div>
    </div>
  );
}
