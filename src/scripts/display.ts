import { store } from './store';

// Theme, motion and text size. The saved values are applied before first paint by an inline
// script in the layout; this wires up the panel and keeps it in sync.
const PREFS = [
  { name: 'theme', attr: 'data-theme', fallback: 'system' },
  { name: 'motion', attr: 'data-motion', fallback: 'system' },
  { name: 'text', attr: 'data-text', fallback: 'md' },
] as const;

export function initDisplayPrefs(): void {
  const root = document.documentElement;
  const btn = document.getElementById('prefs-btn');
  const panel = document.getElementById('prefs');
  if (!btn || !panel) return;
  // Without the Popover API the panel could neither open nor close: leave the feature out
  if (!('popover' in HTMLElement.prototype)) {
    panel.remove();
    return;
  }

  for (const pref of PREFS) {
    const current = root.getAttribute(pref.attr) ?? pref.fallback;
    const input = (document.getElementById(`${pref.name}-${current}`) ??
      document.getElementById(`${pref.name}-${pref.fallback}`)) as HTMLInputElement | null;
    if (input) input.checked = true;

    document.querySelectorAll<HTMLInputElement>(`input[name="${pref.name}"]`).forEach((radio) => {
      radio.addEventListener('change', () => {
        const isDefault = radio.value === pref.fallback;
        if (isDefault) root.removeAttribute(pref.attr);
        else root.setAttribute(pref.attr, radio.value);
        store.set(`pref-${pref.name}`, isDefault ? null : radio.value);
      });
    });
  }

  // The panel is a popover (toggled by the button's popovertarget); place it under the button when it opens
  panel.addEventListener('beforetoggle', (e) => {
    if ((e as ToggleEvent).newState !== 'open') return;
    const r = btn.getBoundingClientRect();
    panel.style.top = `${Math.round(r.bottom + 8)}px`;
    panel.style.right = `${Math.round(document.documentElement.clientWidth - r.right)}px`;
  });
  // Close it when the layout width changes; mobile browsers also fire resize when the address bar
  // collapses during scroll, which must not close it
  let width = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth !== width) panel.hidePopover?.();
    width = innerWidth;
  });
}
