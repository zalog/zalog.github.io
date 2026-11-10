import { jumpTo } from './jump';
import { motionReduced } from './store';

interface Label { text: string; href: string }
interface Point {
  x: number; y: number; z: number; s: number; shell: boolean; halo: boolean; star: boolean; a: boolean;
  sx: number; sy: number; ox: number; oy: number; front: number; rx: number; vis: number;
  spread: number; jx: number; jy: number; jz: number;
}
interface Geometry { cx: number; cy: number; R: number; side: number; minX: number; maxX: number; maxY: number }
interface Vec { x: number; y: number }
interface Spot {
  x: number; y: number; w: number; h: number; x1: number; y1: number; x2: number; y2: number; pinned: boolean;
}
interface Placement { L?: Vec; len: number; sgn: number; w: number; h: number }
interface Tag extends Placement {
  el: HTMLAnchorElement; p: number; L: Vec; born: number; life: number; hover: boolean; seen?: number;
  peak?: number; leaving?: boolean; clash?: number; frozen?: Spot; fa?: number; lastSpot?: Spot; lastBase?: number;
}
interface Cluster {
  live: Tag[]; deck: Label[]; pts: Point[]; next: number; stuck: number;
  ay: number; ax: number; vy: number; vx: number; disp: number | null; pace: number; g: Geometry | null;
}

const SEED = 1.3;
const TAU = 6.2832;
/** One frame at 60 fps, in ms */
const FRAME = 16.667;
/** From this width up, labels go right of the hero text and the cluster gets more particles */
const WIDE = 1024;
/** The page column (`max-w-5xl` in Home.astro) and the hero text in it (`max-w-[38rem]` in Hero.astro) */
const COLUMN_REM = 64, TEXT_REM = 38;
/** The slow idle turn, in radians per frame */
const SPIN = 0.0022;
/** How far a drag turns the cluster, in radians per pixel */
const DRAG_TURN = 0.008;
/** How long a label stays up, in ms: a base time plus some more for each character */
const TAG_LIFE = 3600, TAG_LIFE_PER_CHAR = 70;

function findSurfaces() {
  const canvas = document.querySelector<HTMLCanvasElement>('#bg');
  const lines = document.querySelector<HTMLCanvasElement>('#lines');
  const layer = document.getElementById('tags'), ctx = canvas?.getContext('2d'), lctx = lines?.getContext('2d');
  return canvas && lines && layer && ctx && lctx ? { canvas, lines, layer, ctx, lctx } : null;
}

/**
 * Background: a slowly turning cluster of particles behind the hero. Now and then a tag comes out of it on a
 * short leader line, naming a skill, a result, a past role or a project.
 */
export function initParticles(data: { top: Label[] }): void {
  const root = document.documentElement;
  const surfaces = findSurfaces();
  if (!surfaces) return;
  const { canvas, lines, layer, ctx, lctx } = surfaces;
  let W = 0, H = 0, wide = false, rem = 16, born = 0, raf = 0, still = false, last = 0;
  const col = { fg: '', accent: '', light: false, boost: 1, grow: 1 };
  const pointer = { x: -1e4, y: -1e4 };
  let drag: { x: number; y: number; s: { t: number; dx: number; dy: number }[] } | null = null;
  const cluster: Cluster = {
    live: [], deck: [], pts: [], next: 0, stuck: 0, ay: SEED, ax: -0.25, vy: 0, vx: 0, disp: null, pace: 1, g: null,
  };

  function readColors() {
    const cs = getComputedStyle(root);
    col.fg = cs.getPropertyValue('--fg').trim();
    col.accent = cs.getPropertyValue('--accent').trim();
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(cs.getPropertyValue('--bg').trim());
    const luma = m ? parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114 : 0;
    col.light = luma > 140;
    col.boost = col.light ? 1.55 : 1;
    col.grow = col.light ? 1.2 : 1;
  }

  function unit() {
    const t = Math.random() * TAU, z = Math.random() * 2 - 1, r = Math.sqrt(1 - z * z);
    return [Math.cos(t) * r, Math.sin(t) * r, z];
  }

  function makePoints(n: number): Point[] {
    // A few lobes make the outline lumpy instead of a perfect sphere
    const lobes = [unit(), unit(), unit()], pts: Point[] = [];
    for (let i = 0; i < n; i++) {
      const d = unit(), L = lobes[i % 3], pull = Math.random() * 0.45;
      let x = d[0] + L[0] * pull, y = d[1] + L[1] * pull, z = d[2] + L[2] * pull;
      const m = Math.sqrt(x * x + y * y + z * z);
      x /= m;
      y /= m;
      z /= m;
      const kind = Math.random(), shell = kind < 0.4, halo = kind > 0.72;
      // shell: a soft band near the surface; core: denser toward the middle;
      // halo: a thinning fringe out to ~2.3R so the cluster fades into the page instead of ending at an edge
      const s = shell
        ? 0.86 + Math.random() * 0.14
        : halo ? 1.04 + Math.pow(Math.random(), 1.8) * 1.25 : Math.pow(Math.random(), 0.95) * 0.8;
      const star = Math.random() < 0.035;
      const j = unit();
      pts.push({
        x, y, z, s, shell, halo, star: star && !halo, a: star ? Math.random() < 0.5 : Math.random() < 0.07,
        sx: 0, sy: 0, front: 0, rx: 0, vis: 0, ox: 0, oy: 0,
        spread: 0.8 + Math.random() * 2.8, jx: j[0], jy: j[1], jz: j[2],
      });
    }
    return pts;
  }

  function clearTags() {
    cluster.live.forEach((tg) => tg.el.remove());
    cluster.live = [];
  }

  function build() {
    sizes = {};
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    wide = W >= WIDE;
    rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lines.width = canvas.width;
    lines.height = canvas.height;
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clearTags();
    const n = wide ? 4500 : W < 640 ? 1200 : 2400;
    // same cloud across theme, text size and language changes
    if (cluster.pts.length !== n) cluster.pts = makePoints(n);
    cluster.next = performance.now() + 1500;
    cluster.stuck = 0;
  }

  function geometry(): Geometry | null {
    const hero = document.getElementById('top');
    if (!hero) return null;
    const r = hero.getBoundingClientRect();
    // Sized by the width alone: bound to the height, it would be a small ball over the name on short screens.
    // The 52rem cap keeps it around the column on wide screens.
    const role = hero.querySelector('[data-role]'), roof = role ? role.getBoundingClientRect().top - 10 : r.top + 214;
    const g = { cx: W / 2, cy: roof, R: Math.min(W * 0.55, 52 * rem), side: 0, minX: 12, maxX: W - 12, maxY: roof };
    // Labels go where there is no text: right of the hero text on wide screens, above the role line on narrow ones
    if (wide) {
      const colW = Math.min(W - 32, COLUMN_REM * rem), textRight = (W - colW) / 2 + Math.min(colW, TEXT_REM * rem);
      g.side = 1;
      g.minX = textRight + 16;
      g.maxX = Math.min(W - 12, textRight + 40 * rem);
      g.maxY = r.bottom;
    }
    return g;
  }

  // Areas taken by labels and their lines last frame, plus labels spawned in this one (without motion two
  // spawn in the same frame), so a new label never lands on (or draws across) another
  let occupied: Spot[] = [];

  function overlap(a: Spot, b: Spot, pad: number): boolean {
    return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
  }

  function crosses(s: Spot, r: Spot, pad: number): boolean {
    for (let k = 0; k <= 12; k++) {
      const x = s.x1 + (s.x2 - s.x1) * k / 12, y = s.y1 + (s.y2 - s.y1) * k / 12;
      if (x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad) return true;
    }
    return false;
  }

  function clashes(o: Spot, list: Spot[], gap: number): boolean {
    return list.some((q) => overlap(o, q, gap) || crosses(o, q, gap / 2) || crosses(q, o, gap / 2));
  }

  // where a label sits for a particle, and the line from the particle to the label's square
  function place(tg: Placement, p: Point, g: Geometry): Spot {
    // The leader keeps the direction it was given at spawn: recomputing it from the particle's position
    // swings the label around when the particle passes near the centre of the cluster
    const L = tg.L || leader(g, p), ex = p.sx + L.x * tg.len, ey = p.sy + L.y * tg.len;
    const lx0 = tg.sgn > 0 ? ex : ex - tg.w, ly0 = ey - tg.h / 2;
    const lx = Math.max(g.minX, Math.min(g.maxX - tg.w, lx0));
    const ly = Math.max(8, Math.min(Math.min(H - 8, g.maxY) - tg.h, ly0));
    // ends on the centre of the square, which straddles the label's near border
    const nx = tg.sgn > 0 ? lx - 0.5 : lx + tg.w + 0.5, ny = ly + tg.h / 2;
    const pinned = Math.abs(lx - lx0) > 0.5 || Math.abs(ly - ly0) > 0.5;
    return { x: lx, y: ly, w: tg.w, h: tg.h, x1: p.sx, y1: p.sy, x2: nx, y2: ny, pinned };
  }

  // Leader direction for a particle: outward from the centre, bent toward the cluster's open side
  function leader(g: Geometry, p: Point): Vec {
    let dx = p.sx - g.cx, dy = p.sy - g.cy;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    dx = dx / d * 0.75 + g.side * 0.25;
    dy /= d;
    const n = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: dx / n, y: dy / n };
  }

  // Label sizes, measured once per text (cleared on rebuild, since the text size setting changes them)
  let sizes: Record<string, { w: number; h: number }> = {};

  function measure(text: string) {
    if (!sizes[text]) {
      const m = document.createElement('a');
      m.className = 'tag';
      m.textContent = text;
      m.style.visibility = 'hidden';
      layer.appendChild(m);
      sizes[text] = { w: m.offsetWidth, h: m.offsetHeight };
      m.remove();
    }
    return sizes[text];
  }

  // Labels are dealt from a shuffled deck: each one comes up once per round, in a new order every round.
  // The labels still on screen go at the end of a new round, so none comes back right away.
  function deal(c: Cluster, taken: (string | null)[]) {
    const round = data.top.filter((x) => c.deck.indexOf(x) < 0);
    for (let i = round.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)), t = round[i];
      round[i] = round[j];
      round[j] = t;
    }
    const fresh = round.filter((x) => taken.indexOf(x.text) < 0);
    const shown = round.filter((x) => taken.indexOf(x.text) >= 0);
    c.deck = c.deck.concat(fresh, shown);
  }

  function spawn(c: Cluster, g: Geometry, now: number, life: number) {
    let item!: Label, w = 0, h = 0, len = 0, cand = -1, sgn = 1, spot!: Spot, pick = -1;
    const taken = c.live.map((x) => x.el.textContent);
    const top = (document.querySelector('.sticky-head')?.getBoundingClientRect().bottom ?? 0) + 8;
    if (!c.deck.length) deal(c, taken);
    // A label that finds no room keeps its place at the front of the deck, so it is tried first next time
    // instead of waiting a whole round
    for (let d = 0; d < c.deck.length && cand < 0; d++) {
      item = c.deck[d];
      if (taken.indexOf(item.text) >= 0) continue;
      const size = measure(item.text);
      w = size.w;
      h = size.h;
      len = 30 + Math.random() * 30;
      // how far the label is carried before it goes: on the front face particles move against the spin, about
      // R × vy a frame
      const drift = still ? 0 : -c.vy * g.R * (life + item.text.length * TAG_LIFE_PER_CHAR) / FRAME;
      for (let k = 0; k < 160 && cand < 0; k++) {
        const i = Math.floor(Math.random() * c.pts.length), p = c.pts[i];
        // drawn clearly, on the front face, on the cluster's open side and on the half still turning toward
        // the viewer, so the label gets a long run before it has to go
        if (!p.shell || p.vis < 0.4 || p.front < 0.82) continue;
        if (!still && p.rx * c.vy <= 0) continue;
        if (g.side && (p.sx - g.cx) * g.side < g.R * 0.12) continue;
        const L = leader(g, p), ex = p.sx + L.x * len, ey = p.sy + L.y * len;
        let sg = L.x >= 0 ? 1 : -1, lx = sg > 0 ? ex : ex - w;
        // a label too long for the open side hangs the other way from a steep leader, clear of its particle
        if ((lx < g.minX || lx + w > g.maxX) && Math.abs(L.x) < 0.5) {
          sg = -sg;
          lx = sg > 0 ? ex : ex - w;
        }
        const fitsX = Math.min(lx, lx + drift) >= g.minX && Math.max(lx, lx + drift) + w <= g.maxX;
        const fitsY = ey - h / 2 > top && ey + h / 2 < Math.min(H - 12, g.maxY);
        if (!fitsX || !fitsY) continue;
        const probe = place({ len, sgn: sg, w, h }, p, g);
        // a new label starts well clear of the others (closer on narrow screens, where labels share a thin band);
        // once up, only a near overlap makes one give way
        if (clashes(probe, occupied, (g.side ? 4 : 2) * rem)) continue;
        cand = i;
        sgn = sg;
        spot = probe;
        pick = d;
      }
    }
    // when none of the labels left in the round has found room three times in a row, deal the next round behind them
    if (cand < 0) {
      if (++c.stuck >= 3) {
        c.stuck = 0;
        deal(c, taken);
      }
      return;
    }
    c.stuck = 0;
    c.deck.splice(pick, 1);
    occupied.push(spot);
    const a = document.createElement('a');
    a.className = 'tag';
    a.textContent = item.text;
    a.href = item.href;
    a.tabIndex = -1;
    layer.appendChild(a);
    // the label's square faces its particle
    a.classList.toggle('rev', sgn < 0);
    const tg: Tag = {
      el: a, p: cand, L: leader(g, c.pts[cand]), born: now, w, h, len, sgn, hover: false,
      life: life === Infinity ? life : life + item.text.length * TAG_LIFE_PER_CHAR,
    };
    a.addEventListener('pointerenter', () => {
      tg.hover = true;
    });
    a.addEventListener('pointerleave', () => {
      tg.hover = false;
    });
    c.live.push(tg);
  }

  // Labels are cut off below the sticky header: where they sit above it they would cover it, elsewhere they
  // would show through it
  const head = document.querySelector('.sticky-head');
  let clipTop = -1;

  function clipTags() {
    if (!head) return;
    const top = Math.round(head.getBoundingClientRect().bottom);
    if (top !== clipTop) {
      clipTop = top;
      layer.style.clipPath = `inset(${top}px 0 0 0)`;
    }
  }

  function frame(now: number) {
    clipTags();
    raf = 0;
    if (!born) born = now;
    const age = now - born, placed: Spot[] = [];
    let busy = false;
    // All motion is scaled to a 60 fps frame, so a 120 Hz screen turns the cluster at the same speed
    const dt = Math.min(64, last ? now - last : FRAME), k60 = dt / FRAME;
    last = now;
    const ease = (r: number) => 1 - Math.pow(1 - r, k60);   // per-frame lerp factor r at 60 fps
    const nudge = ease(0.15);
    ctx.clearRect(0, 0, W, H);
    lctx.clearRect(0, 0, W, H);
    const c = cluster, g = c.g = geometry();
    // off screen: its labels are not needed any more (and an invisible label must not catch clicks)
    if (!g || g.cy + g.R < -120 || g.cy - g.R > H + 120) {
      clearTags();
    } else {
      // On load the cluster starts as scattered as it gets on scroll and comes together: 1 at first, easing to 0
      const gather = still ? 0 : Math.pow(1 - Math.min(1, age / 2000), 3);
      // Dispersion: 0 at the top of the page, rising to 1 as the hero scrolls away
      const off = Math.max(0, scrollY / (H * 0.55));
      let target = Math.min(1, off);
      target = target * target * (3 - 2 * target);
      // eased toward the scroll position, so a notched mouse wheel does not make the particles jump
      c.disp = still || c.disp == null ? target : c.disp + (target - c.disp) * ease(0.16);
      const disp = Math.max(c.disp, gather);
      if (Math.abs(target - disp) > 0.002) busy = true;
      // A big cloud turns (and is dragged) at the surface speed of a 320px one, so its labels stay readable
      c.pace = Math.min(1, 320 / g.R);
      if (!still && !drag) {
        // after a drag the spin carries on and eases back to the slow idle turn
        c.vy += (SPIN * c.pace - c.vy) * ease(0.025);
        c.vx += (0 - c.vx) * ease(0.05);
        c.ay += c.vy * k60;
        c.ax = Math.max(-1.3, Math.min(1.3, c.ax + c.vx * k60));
        c.ax += (-0.25 - c.ax) * ease(0.008);
      }
      const ay = c.ay, ax = c.ax, T = still ? 0 : now * 0.00028;
      const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax);
      const fade = Math.pow(1 - disp, 1.6);
      if (fade > 0.01 || c.live.length) busy = true;
      const R = g.R, F = R * 3.2;
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? col.accent : col.fg;
        for (let i = 0; i < c.pts.length; i++) {
          const p = c.pts[i];
          if (p.a !== !!pass) continue;
          // organic surface: a few sines over the direction, drifting in time
          const k = 1 + 0.24 * Math.sin(p.x * 2.6 + T + SEED) * Math.sin(p.y * 2.2 - T * 0.8)
            + 0.1 * Math.sin(p.z * 4 + T * 1.3 + SEED);
          const e = 1 + disp * p.spread, j = disp * 0.9;
          const x = p.x * k * p.s * e + p.jx * j, y = p.y * k * p.s * e + p.jy * j, z = p.z * k * p.s * e + p.jz * j;
          const x1 = x * cyA + z * syA, z1 = -x * syA + z * cyA;
          const y2 = y * cxA - z1 * sxA, z2 = y * sxA + z1 * cxA;
          const persp = F / Math.max(F * 0.3, F + z2 * R);
          const bx = g.cx + x1 * R * persp, by = g.cy + y2 * R * persp;
          if (!still) {
            // the pointer nudges nearby particles aside
            let qx = bx - pointer.x, qy = by - pointer.y, push = 0;
            const qd = qx * qx + qy * qy;
            if (qd < 4900) {
              const qn = Math.sqrt(qd) || 1, f = 1 - qn / 70;
              push = f * f * 14;
              qx /= qn;
              qy /= qn;
            }
            p.ox += (qx * push - p.ox) * nudge;
            p.oy += (qy * push - p.oy) * nudge;
          }
          p.sx = bx + p.ox;
          p.sy = by + p.oy;
          // the half a particle is on (rx) tells if it turns toward the viewer: near the middle the surface
          // drift swamps the change in depth from one frame to the next
          p.rx = x1;
          p.front = (1 - z2) / 2;
          const fr = Math.max(0, Math.min(1, p.front));
          const a = (0.1 + 0.55 * fr) * (p.halo ? 0.32 / p.s : p.shell ? 1 : 1.05) * (pass ? 1.4 : 1)
            * fade * col.boost;
          p.vis = Math.min(1, a);
          if (a < 0.01) continue;
          const sz = (0.6 + 1.6 * fr) * (p.halo ? 0.75 : 1) * col.grow;
          if (p.star) {
            // the few bright particles: a round core with a faint halo, strongest at the front
            ctx.globalAlpha = p.vis * (col.light ? 0.035 : 0.07);   // a grey smudge on light, so keep it faint
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 3 + 4 * fr, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = Math.min(1, a * 1.7);
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 0.9 + 1.1 * fr, 0, TAU);
            ctx.fill();
            continue;
          }
          ctx.globalAlpha = p.vis;
          ctx.fillRect(p.sx - sz / 2, p.sy - sz / 2, sz, sz);
        }
      }
      // While the cluster is being dragged or is still spinning fast, labels would be whipped around
      // with their particles: let the current ones fade out and hold new ones until it settles
      const fast = !!drag || Math.abs(c.vy) > 0.008 || Math.abs(c.vx) > 0.006;
      if (fast && !still) {
        c.live.forEach((tg) => {
          if (!tg.clash) tg.clash = now;
        });
        c.next = Math.max(c.next, now + 700);
      }
      const onStage = g.cy > 90 && g.cy < H - 60 && disp < 0.25 && !fast;
      if (!still && onStage && now > c.next && c.live.length < 2 && gather === 0) {
        spawn(c, g, now, TAG_LIFE);
        c.next = now + (1700 + Math.random() * 1700) * (g.side ? 1 : 0.6);
      }
      if (still && onStage && !c.live.length) {
        spawn(c, g, now, Infinity);
        spawn(c, g, now, Infinity);
      }
      c.live = c.live.filter((tg) => {
        let t0 = now - tg.born;
        if (tg.hover && t0 > tg.life - 600) tg.born += now - (tg.seen || now);   // hold while hovered
        tg.seen = now;
        t0 = now - tg.born;
        if (t0 > tg.life) {
          tg.el.remove();
          return false;
        }
        const p = c.pts[tg.p];
        // Fade with the particle: full while it faces the viewer, gone by the time it reaches the rim.
        // Once it has started turning away the label only fades further, it never comes back.
        let face = Math.max(0, Math.min(1, (p.front - 0.5) / 0.25));
        if (!still) {
          if (tg.peak == null) tg.peak = face;
          if (face < tg.peak && p.rx * c.vy < 0) tg.leaving = true;
          if (tg.leaving) {
            tg.peak = Math.min(tg.peak, face);
            face = tg.peak;
          } else {
            tg.peak = Math.max(tg.peak, face);
          }
        } else {
          face = 1;
        }
        if (!still && face < 0.02) {
          tg.el.remove();
          return false;
        }
        // A label on its way out (it would overlap another, hit a screen edge, or the cluster is being
        // spun) lets go of its particle: it stays where it is and fades, instead of being dragged along
        const spot = tg.frozen || place(tg, p, g);
        if (!still && !tg.clash && (spot.pinned || clashes(spot, placed, 6))) tg.clash = now;
        const base = Math.min(1, t0 / 350, (tg.life - t0) / 450) * face;
        // freeze at what was on screen last frame: the particle may already have whipped round since
        if (tg.clash && !tg.frozen) {
          tg.frozen = tg.lastSpot || spot;
          tg.fa = tg.lastBase != null ? tg.lastBase : base;
        }
        if (!tg.frozen) {
          tg.lastSpot = spot;
          tg.lastBase = base;
        }
        const gone = tg.clash ? 1 - (now - tg.clash) / 250 : 1;
        if (gone <= 0) {
          tg.el.remove();
          return false;
        }
        let a = still ? 1 : (tg.fa ?? base) * gone;
        a *= Math.max(0, 1 - disp * 3);
        tg.el.classList.toggle('gone', a < 0.2);
        if (a > 0.05) placed.push(spot);
        // a faint ring around the particle, and a line from the ring to the centre of the label's square
        // (a detached label fades them twice as fast)
        const la = tg.frozen ? a * Math.max(0, 2 * gone - 1) : a;
        if (la > 0.01) {
          const dx = spot.x2 - spot.x1, dy = spot.y2 - spot.y1, d = Math.sqrt(dx * dx + dy * dy) || 1;
          lctx.lineWidth = 1;
          lctx.globalAlpha = la * 0.5;
          lctx.strokeStyle = col.accent;
          lctx.beginPath();
          lctx.arc(spot.x1, spot.y1, 5, 0, TAU);
          lctx.stroke();
          lctx.globalAlpha = la * 0.6;
          lctx.strokeStyle = col.fg;
          lctx.beginPath();
          lctx.moveTo(spot.x1 + dx / d * 5, spot.y1 + dy / d * 5);
          lctx.lineTo(spot.x2, spot.y2);
          lctx.stroke();
        }
        tg.el.style.transform = `translate(${spot.x.toFixed(1)}px,${spot.y.toFixed(1)}px)`;
        tg.el.style.opacity = a.toFixed(3);
        return true;
      });
    }
    occupied = placed;
    ctx.globalAlpha = 1;
    // Keep looping only while the cluster is visible (or a tag is still up); scrolling back wakes it again
    if (!still && !document.hidden && (busy || drag)) raf = requestAnimationFrame(frame);
  }

  function draw() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function restart(replay: boolean) {
    cancelAnimationFrame(raf);
    raf = 0;
    still = motionReduced();
    readColors();
    if (replay) born = 0;
    build();
    draw();
  }

  // Drag anywhere on the cluster to turn it. Controls keep working, and a press right on a line of text still
  // selects it: what counts is the glyphs under the pointer, not the (often much wider) element boxes.
  const NOGRAB = 'a,button,input,select,textarea,label,summary,.tag,[contenteditable]';

  function overText(x: number, y: number): boolean {
    let node: Node | undefined, off = 0;
    if (document.caretPositionFromPoint) {
      const cp = document.caretPositionFromPoint(x, y);
      if (cp) {
        node = cp.offsetNode;
        off = cp.offset;
      }
    } else if (document.caretRangeFromPoint) {
      const cr = document.caretRangeFromPoint(x, y);
      if (cr) {
        node = cr.startContainer;
        off = cr.startOffset;
      }
    }
    if (!node || node.nodeType !== 3) return false;
    const len = (node as Text).length;
    if (!len) return false;
    const r = document.createRange();
    for (let i = Math.max(0, off - 1); i <= Math.min(len - 1, off); i++) {
      r.setStart(node, i);
      r.setEnd(node, i + 1);
      const b = r.getBoundingClientRect();
      if (x >= b.left - 2 && x <= b.right + 2 && y >= b.top - 2 && y <= b.bottom + 2) return true;
    }
    return false;
  }

  function canGrab(e: PointerEvent): boolean {
    const t = e.target as Element;
    return !(t.closest && t.closest(NOGRAB)) && !overText(e.clientX, e.clientY);
  }

  function hit(x: number, y: number): boolean {
    // once scattered on scroll the cluster is not there any more, even though its last position is kept
    const g = cluster.g, disp = cluster.disp;
    return !!g && (disp == null || disp < 0.5) && Math.hypot(x - g.cx, y - g.cy) < g.R * 1.15;
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      const turn = DRAG_TURN * cluster.pace;
      cluster.ay -= dx * turn;
      cluster.ax = Math.max(-1.3, Math.min(1.3, cluster.ax + dy * turn));
      const tnow = performance.now();
      drag.s.push({ t: tnow, dx, dy });
      while (drag.s.length && tnow - drag.s[0].t > 80) drag.s.shift();
    } else {
      root.classList.toggle('grab', !still && hit(e.clientX, e.clientY) && canGrab(e));
    }
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });

  addEventListener('pointerdown', (e) => {
    if (still || e.pointerType !== 'mouse' || e.button !== 0) return;
    if (!hit(e.clientX, e.clientY) || !canGrab(e)) return;
    e.preventDefault();
    drag = { x: e.clientX, y: e.clientY, s: [] };
    cluster.vx = cluster.vy = 0;
    root.classList.add('dragging');
  });

  function endDrag() {
    if (!drag) return;
    // carry on with the speed of the last 80ms, as radians per 60 fps frame
    const tnow = performance.now(), s = drag.s.filter((q) => tnow - q.t <= 80);
    let sx = 0, sy = 0;
    s.forEach((q) => {
      sx += q.dx;
      sy += q.dy;
    });
    const span = s.length ? Math.max(FRAME, tnow - s[0].t) : 1, turn = DRAG_TURN * cluster.pace;
    const cap = (v: number) => Math.max(-0.05, Math.min(0.05, v));   // a hard flick still settles gracefully
    cluster.vy = s.length ? cap(-sx / span * FRAME * turn) : 0;
    cluster.vx = s.length ? cap(sy / span * FRAME * turn) : 0;
    drag = null;
    root.classList.remove('dragging');
    draw();
  }

  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  addEventListener('blur', endDrag);
  // pointerleave is dispatched to elements, not to the document: listen on the root element
  root.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -1e4;
  });
  addEventListener('scroll', draw, { passive: true });
  document.addEventListener('visibilitychange', draw);
  let rt: ReturnType<typeof setTimeout> | undefined, lastW = innerWidth;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (innerWidth !== lastW || innerWidth >= WIDE) {
        lastW = innerWidth;
        restart(false);
      }
    }, 150);
  });
  new MutationObserver(() => {
    readColors();
    draw();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(() => restart(false)).observe(root, { attributes: true, attributeFilter: ['data-text'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    readColors();
    draw();
  });
  // The Display panel's motion setting and the OS setting both restart it (still or animated)
  new MutationObserver(() => restart(false)).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => restart(false));
  restart(true);
}

/** A label in the background jumps to the row it names and lights it up (see jump.ts) */
export function initTagLinks(): void {
  const layer = document.getElementById('tags');
  if (!layer) return;
  layer.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.tag');
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById((a.getAttribute('href') ?? '').slice(1));
    if (target) jumpTo(target);
  });
}
