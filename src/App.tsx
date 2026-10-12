import { useState } from 'preact/hooks';
import { GenrePanel } from './components/GenrePanel';
import { PhrasingPanel } from './components/PhrasingPanel';

export function App() {
  const [set, setSet] = useState(0);
  const [style, setStyle] = useState(0);
  const [variation, setVariation] = useState(0);

  return (
    <main class="app">
      <header class="masthead">
        <span class="brand">Chord Reference</span>
        <span class="model">Roland J-6</span>
      </header>
      <GenrePanel set={set} onSetChange={setSet} />
      <PhrasingPanel
        style={style}
        variation={variation}
        onStyleChange={setStyle}
        onVariationChange={setVariation}
      />
    </main>
  );
}
