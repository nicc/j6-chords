import { fireEvent, render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';
import { DIGIT_SEGMENTS } from '../src/components/SevenSegment';

const click = (name: string, times = 1) => {
  for (let i = 0; i < times; i++) fireEvent.click(screen.getByRole('button', { name }));
};

const litSegments = (spin: HTMLElement) =>
  Array.from(spin.querySelectorAll('.seg.on')).map((s) => s.getAttribute('data-seg'));

const setGenre = (n: number) => {
  const [h, t, o] = String(n).padStart(3, '0').split('').map(Number) as [number, number, number];
  click('Genre hundreds up', h);
  click('Genre tens up', t);
  click('Genre ones up', o);
};

const openPhrasing = () => click('Phrasing');
const key = (name: string) => document.querySelector(`[data-key="${name}"]`) as HTMLElement;

describe('genre', () => {
  it('starts at 000 with no lookup shown', () => {
    render(<App />);
    expect(screen.getByRole('spinbutton', { name: 'Genre hundreds' })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('heading', { level: 2 })).toBeEmptyDOMElement();
    expect(document.querySelectorAll('.chord-name')).toHaveLength(0);
  });

  it('draws the selected digit in segments', () => {
    render(<App />);
    click('Genre ones up', 7);
    const ones = screen.getByRole('spinbutton', { name: 'Genre ones' });
    expect(litSegments(ones).sort()).toEqual([...DIGIT_SEGMENTS[7]!].sort());
  });

  it('shows genre, description and chords as soon as a set is selected', () => {
    render(<App />);
    click('Genre ones up');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pop');
    expect(screen.getByText(/Bright, familiar harmony/)).toBeInTheDocument();
    expect(key('C')).toHaveTextContent('Cadd9');
    expect(key('B')).toHaveTextContent('G/B');
  });

  it('wraps each digit independently', () => {
    render(<App />);
    click('Genre ones down');
    expect(screen.getByRole('spinbutton', { name: 'Genre ones' })).toHaveAttribute('aria-valuenow', '9');
    expect(screen.getByRole('spinbutton', { name: 'Genre tens' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('cannot go past 100', () => {
    render(<App />);
    setGenre(45);
    click('Genre hundreds up');
    expect(screen.getByRole('heading', { level: 2 })).not.toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: 'Genre tens up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Genre ones down' })).toBeDisabled();
  });

  it('steps by swiping: up increments, down decrements', () => {
    render(<App />);
    const ones = screen.getByRole('spinbutton', { name: 'Genre ones' });
    fireEvent.pointerDown(ones, { clientY: 200, pointerId: 1 });
    fireEvent.pointerMove(ones, { clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(ones, { clientY: 150, pointerId: 1 });
    expect(ones).toHaveAttribute('aria-valuenow', '2');
    fireEvent.pointerDown(ones, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(ones, { clientY: 125, pointerId: 1 });
    fireEvent.pointerUp(ones, { clientY: 125, pointerId: 1 });
    expect(ones).toHaveAttribute('aria-valuenow', '1');
  });

  it('steps with arrow keys', () => {
    render(<App />);
    const tens = screen.getByRole('spinbutton', { name: 'Genre tens' });
    fireEvent.keyDown(tens, { key: 'ArrowUp' });
    expect(tens).toHaveAttribute('aria-valuenow', '1');
  });
});

describe('keyboard hold', () => {
  it('hides chord names and labels the held chord’s notes with octaves', () => {
    render(<App />);
    setGenre(2);
    // Set 2, key C: Cmaj9 = C3 E3 B3 D4
    fireEvent.pointerDown(key('C'));
    expect(document.querySelector('.keyboard')).toHaveClass('holding');
    const lit = Array.from(document.querySelectorAll('.key.lit')).map((k) => [
      k.getAttribute('data-key'),
      k.querySelector('.voicing')?.textContent,
    ]);
    expect(lit).toEqual([
      ['C', 'C3'],
      ['D', 'D4'],
      ['E', 'E3'],
      ['B', 'B3'],
    ]);
    fireEvent.pointerUp(key('C'));
    expect(document.querySelector('.keyboard')).not.toHaveClass('holding');
    expect(document.querySelectorAll('.key.lit')).toHaveLength(0);
  });

  it('stacks two octaves on one key', () => {
    render(<App />);
    setGenre(14);
    fireEvent.pointerDown(key('C'));
    expect(key('C').querySelector('.voicing')?.textContent).toBe('C4C5');
  });

  it('does nothing at genre 0', () => {
    render(<App />);
    fireEvent.pointerDown(key('C'));
    expect(document.querySelectorAll('.key.lit')).toHaveLength(0);
  });
});

describe('phrasing', () => {
  it('is collapsed by default and opens on demand', () => {
    render(<App />);
    expect(screen.queryByRole('spinbutton', { name: 'Style' })).toBeNull();
    openPhrasing();
    expect(screen.getByRole('spinbutton', { name: 'Style' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Variation tens' })).toBeInTheDocument();
  });

  const text = () => document.querySelector('.phrasing-text')!.textContent;

  it('shows style as soon as it is selected, then adds variation', () => {
    render(<App />);
    openPhrasing();
    expect(text()).toBe('');
    click('Style up', 2);
    expect(text()).toBe('Arp 16ths:');
    click('Variation ones up');
    expect(text()).toBe('Arp 16ths: up 1');
  });

  it('waits on style when variation is chosen first', () => {
    render(<App />);
    openPhrasing();
    click('Variation ones up', 3);
    expect(text()).toBe('');
    click('Style up');
    expect(text()).toBe('Arp 8ths: down 1');
  });

  it('shows only category and name for styles without variations', () => {
    render(<App />);
    openPhrasing();
    click('Style down', 3); // 0 -> 9 -> 8 -> 7
    click('Variation ones up', 4);
    expect(text()).toBe('Phrased chords (rhythmic)');
  });

  it('caps variation at 12', () => {
    render(<App />);
    openPhrasing();
    click('Variation ones up', 9);
    click('Variation tens up');
    expect(screen.getByRole('spinbutton', { name: 'Variation ones' })).toHaveAttribute('aria-valuenow', '2');
  });

  it('keeps its values when collapsed and reopened', () => {
    render(<App />);
    openPhrasing();
    click('Style up', 4);
    openPhrasing();
    openPhrasing();
    expect(text()).toBe('Beat pattern:');
  });

  it('shows the legend in a popup without the notes', () => {
    render(<App />);
    openPhrasing();
    click('Legend');
    const dialog = screen.getByRole('dialog', { name: 'Legend' });
    expect(within(dialog).getByText('16th rest')).toBeInTheDocument();
    expect(within(dialog).getByText('dotted 8th note')).toBeInTheDocument();
    expect(within(dialog).queryByText(/VARIATION knob/)).toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
