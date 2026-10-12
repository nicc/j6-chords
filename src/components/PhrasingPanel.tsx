import { useCallback, useState } from 'preact/hooks';
import { LEGEND, STYLE_RANGE, VARIATION_RANGE, phrasingText } from '../lib/lookup';
import { Popup } from './Popup';
import { SegmentInput } from './SegmentInput';

type Props = {
  readonly style: number;
  readonly variation: number;
  readonly onStyleChange: (n: number) => void;
  readonly onVariationChange: (n: number) => void;
};

export function PhrasingPanel({ style, variation, onStyleChange, onVariationChange }: Props) {
  const [open, setOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const closeLegend = useCallback(() => setLegendOpen(false), []);
  const text = phrasingText(style, variation);

  return (
    <section class="phrasing">
      <button
        type="button"
        class="section-toggle"
        aria-expanded={open}
        aria-controls="phrasing-body"
        onClick={() => setOpen((o) => !o)}
      >
        <svg class="toggle-tri" viewBox="0 0 10 10" aria-hidden="true">
          <polygon points="2,0 10,5 2,10" />
        </svg>
        Phrasing
      </button>
      {open && (
        <div id="phrasing-body" class="phrasing-body">
          <div class="phrasing-inputs">
            <SegmentInput label="Style" value={style} range={STYLE_RANGE} onChange={onStyleChange} />
            <div class="roland-divider" aria-hidden="true" />
            <SegmentInput label="Variation" value={variation} range={VARIATION_RANGE} onChange={onVariationChange} />
          </div>
          <p class="phrasing-text" aria-live="polite">
            {text}
          </p>
          <button type="button" class="tab-button" onClick={() => setLegendOpen(true)}>
            Legend
          </button>
        </div>
      )}
      {legendOpen && (
        <Popup title="Legend" onClose={closeLegend}>
          <dl class="legend">
            {Object.entries(LEGEND).map(([symbol, meaning]) => (
              <div key={symbol} class="legend-row">
                <dt>{symbol}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </Popup>
      )}
    </section>
  );
}
