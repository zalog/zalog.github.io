// localStorage that never throws (private windows, blocked storage)
export const store = {
  set(key: string, value: string | null): void {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* storage blocked: the setting lasts only until the page is left */
    }
  },
};

/** True when animations should be off: the Display setting wins, otherwise the OS setting. */
export function motionReduced(): boolean {
  const m = document.documentElement.getAttribute('data-motion');
  if (m === 'reduce') return true;
  if (m === 'full') return false;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
