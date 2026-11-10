import { motionReduced } from './store';

let cancel = () => {};

/**
 * Scrolls to a row or a section (opening "Earlier …" around it and clearing the projects filter when needed)
 * and lights it up once the scroll has stopped, so it is clear where the click led.
 */
export function jumpTo(target: HTMLElement): void {
  const det = target.closest('details');
  if (det && !det.open) det.open = true;
  if (target.closest('[hidden]')) document.querySelector<HTMLElement>('[data-tech="all"]')?.click();
  target.classList.remove('flashing');
  target.classList.add('flash');
  const behavior = motionReduced() ? 'auto' : 'smooth';
  scrollTo({ top: bandPlace(target), behavior });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  cancel();
  // The page can still shift while it scrolls, so the place is checked once more before the band lights up
  cancel = whenScrollStops(() => {
    const top = Math.max(0, Math.min(bandPlace(target), document.documentElement.scrollHeight - innerHeight));
    const light = () => target.classList.add('flashing');
    if (Math.abs(top - scrollY) < 2) return light();
    scrollTo({ top, behavior });
    cancel = whenScrollStops(light);
  });
}

/**
 * The scroll position that centres a target's `.flash` band (which reaches past the target) under the sticky header,
 * or puts it 1rem under the header when it is too tall
 */
function bandPlace(target: HTMLElement): number {
  const over = Math.max(0, -parseFloat(getComputedStyle(target, '::after').top) || 0);
  const head = document.querySelector('.sticky-head')?.getBoundingClientRect().bottom ?? 0;
  const room = innerHeight - head, r = target.getBoundingClientRect(), band = r.height + 2 * over;
  const at = (band > room - 32 ? head + 16 : head + (room - band) / 2) + over;
  // a row still waiting below the screen is shifted down by its reveal animation, which is over once it is in view
  const cs = getComputedStyle(target), shift = cs.transform === 'none' ? 0 : new DOMMatrixReadOnly(cs.transform).m42;
  return scrollY + r.top - shift - at;
}

/** In-page links marked `data-jump` (the nav, the hero buttons) go there the same way and keep the address in the URL */
export function initJumpLinks(): void {
  document.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-jump]');
    const target = a && document.getElementById(a.hash.slice(1));
    if (!a || !target) return;
    e.preventDefault();
    history.pushState(null, '', a.hash);
    jumpTo(target);
  });
}

/** Calls `fn` once the page has not scrolled for 150 ms; returns a function that cancels it */
function whenScrollStops(fn: () => void): () => void {
  let timer = setTimeout(done, 150);
  const onScroll = () => {
    clearTimeout(timer);
    timer = setTimeout(done, 150);
  };
  addEventListener('scroll', onScroll, { passive: true });
  function stop() {
    clearTimeout(timer);
    removeEventListener('scroll', onScroll);
  }
  function done() {
    stop();
    fn();
  }
  return stop;
}
