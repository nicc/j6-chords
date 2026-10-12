// One LED digit drawn as seven hexagonal segments, slanted like Roland's red LED displays.

const W = 40;
const H = 72;
const T = 7; // segment thickness
const GAP = 1;
const SLANT = 6; // degrees
const SHIFT = Math.tan((SLANT * Math.PI) / 180) * H;

const h = T / 2;
const horizontal = (y: number, x1: number, x2: number): string =>
  `${x1 + GAP},${y} ${x1 + GAP + h},${y - h} ${x2 - GAP - h},${y - h} ${x2 - GAP},${y} ${x2 - GAP - h},${y + h} ${x1 + GAP + h},${y + h}`;
const vertical = (x: number, y1: number, y2: number): string =>
  `${x},${y1 + GAP} ${x + h},${y1 + GAP + h} ${x + h},${y2 - GAP - h} ${x},${y2 - GAP} ${x - h},${y2 - GAP - h} ${x - h},${y1 + GAP + h}`;

const [L, R, TOP, MID, BOT] = [h, W - h, h, H / 2, H - h];

export const SEGMENTS = {
  a: horizontal(TOP, L, R),
  b: vertical(R, TOP, MID),
  c: vertical(R, MID, BOT),
  d: horizontal(BOT, L, R),
  e: vertical(L, MID, BOT),
  f: vertical(L, TOP, MID),
  g: horizontal(MID, L, R),
} as const;

type Segment = keyof typeof SEGMENTS;

export const DIGIT_SEGMENTS: readonly (readonly Segment[])[] = [
  ['a', 'b', 'c', 'd', 'e', 'f'],
  ['b', 'c'],
  ['a', 'b', 'g', 'e', 'd'],
  ['a', 'b', 'g', 'c', 'd'],
  ['f', 'g', 'b', 'c'],
  ['a', 'f', 'g', 'c', 'd'],
  ['a', 'f', 'g', 'e', 'd', 'c'],
  ['a', 'b', 'c'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'f', 'g'],
];

export function SevenSegment({ digit }: { digit: number }) {
  const lit = DIGIT_SEGMENTS[digit] ?? [];
  return (
    <svg viewBox={`0 0 ${W + SHIFT} ${H}`} aria-hidden="true">
      <g transform={`translate(${SHIFT} 0) skewX(${-SLANT})`}>
        {(Object.keys(SEGMENTS) as Segment[]).map((s) => (
          <polygon key={s} points={SEGMENTS[s]} class={lit.includes(s) ? 'seg on' : 'seg'} data-seg={s} />
        ))}
      </g>
    </svg>
  );
}
