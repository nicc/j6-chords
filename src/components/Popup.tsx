import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

type Props = { readonly title: string; readonly onClose: () => void; readonly children: ComponentChildren };

export function Popup({ title, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div class="popup-backdrop" onClick={onClose}>
      <div class="popup" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div class="popup-head">
          <span class="bracket">{title}</span>
          <button type="button" class="popup-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
