import { jumpTo } from './jump';
import { motionReduced } from './store';

export interface Label { text: string; href: string }
export interface ParticleData { top: Label[] }

interface Point {
  x: number; y: number; z: number; dist: number; shell: boolean; halo: boolean; star: boolean; accent: boolean;
  sx: number; sy: number; pushX: number; pushY: number; front: number; turnedX: number; alpha: number;
  spread: number; scatterX: number; scatterY: number; scatterZ: number;
}
interface Geometry { cx: number; cy: number; R: number; side: number; minX: number; maxX: number; maxY: number }
interface Vec { x: number; y: number }
interface Spot {
  x: number; y: number; w: number; h: number; x1: number; y1: number; x2: number; y2: number; pinned: boolean;
}
interface Placement { dir: Vec; len: number; sgn: number; w: number; h: number }
interface Shown { spot: Spot; alpha: number }
interface Tag extends Placement {
  el: HTMLAnchorElement; label: Label; point: number; born: number; life: number; seen: number;
  hover: boolean; leaving: boolean; peak?: number; clashAt?: number; frozen?: Shown; last?: Shown;
}
interface Cluster {
  live: Tag[]; deck: Label[]; pts: Point[]; next: number; stuck: number; turn: number; tilt: number;
  turnSpeed: number; tiltSpeed: number; disp: number | null; pace: number; g: Geometry | null;
}
interface DragSample { t: number; dx: number; dy: number }

const TAU = 6.2832;
/** One frame at 60 fps, in ms */
const FRAME = 16.667;
/** From this width up, labels go right of the hero text and the cluster gets more particles */
const WIDE = 1024;
/** The page column (`max-w-5xl` in Home.astro) and the hero text in it (`max-w-[38rem]` in Hero.astro) */
const COLUMN_REM = 64, TEXT_REM = 38;
/** Where the turn starts, and the phase of the ripples on the surface, in radians */
const START_TURN = 1.3, SURFACE_PHASE = 1.3;
/** The slow idle turn, in radians per frame */
const SPIN = 0.0022;
/** The tilt the cluster eases back to, and how far a drag may tilt it, in radians */
const TILT_REST = -0.25, TILT_MAX = 1.3;
/** How far a drag turns the cluster, in radians per pixel */
const DRAG_TURN = 0.008;
/** A flick keeps the speed of the drag's last FLICK_MS, up to FLICK_MAX radians per frame */
const FLICK_MS = 80, FLICK_MAX = 0.05;
/** How close the pointer has to be to push a particle aside, in px */
const PUSH_REACH = 70;
/** How long a label stays up, in ms: a base time plus some more for each character */
const TAG_LIFE = 3600, TAG_LIFE_PER_CHAR = 70;
/** Pointer position while the pointer is not over the page */
const NO_POINTER = -1e4;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function findSurfaces() {
  const canvas = document.querySelector<HTMLCanvasElement>('#bg');
  const lines = document.querySelector<HTMLCanvasElement>('#lines');
  const layer = document.getElementById('tags'), ctx = canvas?.getContext('2d'), lctx = lines?.getContext('2d');
  return canvas && lines && layer && ctx && lctx ? { canvas, lines, layer, ctx, lctx } : null;
}

function unit(): [number, number, number] {
  const t = Math.random() * TAU, z = Math.random() * 2 - 1, r = Math.sqrt(1 - z * z);
  return [Math.cos(t) * r, Math.sin(t) * r, z];
}

function makePoints(n: number): Point[] {
  // A few lobes make the outline lumpy instead of a perfect sphere
  const lobes = [unit(), unit(), unit()], pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const d = unit(), lobe = lobes[i % 3], pull = Math.random() * 0.45;
    let x = d[0] + lobe[0] * pull, y = d[1] + lobe[1] * pull, z = d[2] + lobe[2] * pull;
    const m = Math.sqrt(x * x + y * y + z * z);
    x /= m;
    y /= m;
    z /= m;
    const kind = Math.random(), shell = kind < 0.4, halo = kind > 0.72;
    // shell: a soft band near the surface; core: denser toward the middle;
    // halo: a thinning fringe out to ~2.3R so the cluster fades into the page instead of ending at an edge
    const dist = shell
      ? 0.86 + Math.random() * 0.14
      : halo ? 1.04 + Math.pow(Math.random(), 1.8) * 1.25 : Math.pow(Math.random(), 0.95) * 0.8;
    const star = Math.random() < 0.035;
    const scatter = unit();
    pts.push({
      x, y, z, dist, shell, halo, star: star && !halo, accent: star ? Math.random() < 0.5 : Math.random() < 0.07,
      sx: 0, sy: 0, pushX: 0, pushY: 0, front: 0, turnedX: 0, alpha: 0,
      spread: 0.8 + Math.random() * 2.8, scatterX: scatter[0], scatterY: scatter[1], scatterZ: scatter[2],
    });
  }
  return pts;
}

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

/** Leader direction for a particle: outward from the centre, bent toward the cluster's open side */
function leader(g: Geometry, p: Point): Vec {
  let dx = p.sx - g.cx, dy = p.sy - g.cy;
  const d = Math.sqrt(dx * dx + dy * dy) || 1;
  dx = dx / d * 0.75 + g.side * 0.25;
  dy /= d;
  const n = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: dx / n, y: dy / n };
}

function createTag(text: string) {
  const a = document.createElement('a');
  a.className = 'tag';
  a.textContent = text;
  return a;
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
  if (!(node instanceof Text)) return false;
  const r = document.createRange();
  for (let i = Math.max(0, off - 1); i <= Math.min(node.length - 1, off); i++) {
    r.setStart(node, i);
    r.setEnd(node, i + 1);
    const b = r.getBoundingClientRect();
    if (x >= b.left - 2 && x <= b.right + 2 && y >= b.top - 2 && y <= b.bottom + 2) return true;
  }
  return false;
}

function canGrab(e: PointerEvent): boolean {
  const onControl = e.target instanceof Element && !!e.target.closest(NOGRAB);
  return !onControl && !overText(e.clientX, e.clientY);
}

/**
 * Background: a slowly turning cluster of particles behind the hero. Now and then a tag comes out of it on a
 * short leader line, naming a skill, a result, a past role or a project.
 */
export function initParticles(data: ParticleData): void {
  const root = document.documentElement;
  const surfaces = findSurfaces();
  if (!surfaces) return;
  const { canvas, lines, layer, ctx, lctx } = surfaces;
  // Labels are cut off below the sticky header: where they sit above it they would cover it, elsewhere they
  // would show through it
  const head = document.querySelector('.sticky-head');
  let W = 0, H = 0, wide = false, rem = 16, born = 0, raf = 0, still = false, last = 0, clipTop = -1;
  const col = { fg: '', accent: '', light: false, boost: 1, grow: 1 };
  const pointer = { x: NO_POINTER, y: NO_POINTER };
  let drag: { x: number; y: number; samples: DragSample[] } | null = null;
  const cluster: Cluster = {
    live: [], deck: [], pts: [], next: 0, stuck: 0, turn: START_TURN, tilt: TILT_REST,
    turnSpeed: 0, tiltSpeed: 0, disp: null, pace: 1, g: null,
  };
  // Areas taken by labels and their lines last frame, plus labels spawned in this one (without motion two
  // spawn in the same frame), so a new label never lands on (or draws across) another
  let occupied: Spot[] = [];
  // Label sizes, measured once per text (cleared on rebuild, since the text size setting changes them)
  const sizes = new Map<string, { w: number; h: number }>();

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

  function clearTags() {
    cluster.live.forEach((tg) => tg.el.remove());
    cluster.live = [];
  }

  function build() {
    sizes.clear();
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

  /** Where a label sits for a particle, and the line from the particle to the label's square */
  function place(tg: Placement, p: Point, g: Geometry): Spot {
    const ex = p.sx + tg.dir.x * tg.len, ey = p.sy + tg.dir.y * tg.len;
    const lx0 = tg.sgn > 0 ? ex : ex - tg.w, ly0 = ey - tg.h / 2;
    const lx = clamp(lx0, g.minX, g.maxX - tg.w);
    const ly = clamp(ly0, 8, Math.min(H - 8, g.maxY) - tg.h);
    // ends on the centre of the square, which straddles the label's near border
    const nx = tg.sgn > 0 ? lx - 0.5 : lx + tg.w + 0.5, ny = ly + tg.h / 2;
    const pinned = Math.abs(lx - lx0) > 0.5 || Math.abs(ly - ly0) > 0.5;
    return { x: lx, y: ly, w: tg.w, h: tg.h, x1: p.sx, y1: p.sy, x2: nx, y2: ny, pinned };
  }

  function measure(text: string) {
    let size = sizes.get(text);
    if (!size) {
      const m = createTag(text);
      m.style.visibility = 'hidden';
      layer.appendChild(m);
      size = { w: m.offsetWidth, h: m.offsetHeight };
      sizes.set(text, size);
      m.remove();
    }
    return size;
  }

  // Labels are dealt from a shuffled deck: each one comes up once per round, in a new order every round.
  // The labels still on screen go at the end of a new round, so none comes back right away.
  function deal(taken: string[]) {
    const round = data.top.filter((x) => !cluster.deck.includes(x));
    for (let i = round.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [round[i], round[j]] = [round[j], round[i]];
    }
    const fresh = round.filter((x) => !taken.includes(x.text));
    const shown = round.filter((x) => taken.includes(x.text));
    cluster.deck = cluster.deck.concat(fresh, shown);
  }

  // A label that finds no room keeps its place at the front of the deck, so it is tried first next time
  // instead of waiting a whole round
  function findRoom(g: Geometry, taken: string[], life: number) {
    const c = cluster, top = (head?.getBoundingClientRect().bottom ?? 0) + 8;
    for (let index = 0; index < c.deck.length; index++) {
      const label = c.deck[index];
      if (taken.includes(label.text)) continue;
      const { w, h } = measure(label.text);
      const len = 30 + Math.random() * 30;
      // how far the label is carried before it goes: on the front face particles move against the spin, about
      // R × turnSpeed a frame
      const drift = still ? 0 : -c.turnSpeed * g.R * (life + label.text.length * TAG_LIFE_PER_CHAR) / FRAME;
      for (let k = 0; k < 160; k++) {
        const point = Math.floor(Math.random() * c.pts.length), p = c.pts[point];
        // drawn clearly, on the front face, on the cluster's open side and on the half still turning toward
        // the viewer, so the label gets a long run before it has to go
        if (!p.shell || p.alpha < 0.4 || p.front < 0.82) continue;
        if (!still && p.turnedX * c.turnSpeed <= 0) continue;
        if (g.side && (p.sx - g.cx) * g.side < g.R * 0.12) continue;
        const dir = leader(g, p), ex = p.sx + dir.x * len, ey = p.sy + dir.y * len;
        let sgn = dir.x >= 0 ? 1 : -1, lx = sgn > 0 ? ex : ex - w;
        // a label too long for the open side hangs the other way from a steep leader, clear of its particle
        if ((lx < g.minX || lx + w > g.maxX) && Math.abs(dir.x) < 0.5) {
          sgn = -sgn;
          lx = sgn > 0 ? ex : ex - w;
        }
        const fitsX = Math.min(lx, lx + drift) >= g.minX && Math.max(lx, lx + drift) + w <= g.maxX;
        const fitsY = ey - h / 2 > top && ey + h / 2 < Math.min(H - 12, g.maxY);
        if (!fitsX || !fitsY) continue;
        const placement = { dir, len, sgn, w, h }, spot = place(placement, p, g);
        // a new label starts well clear of the others (closer on narrow screens, where labels share a thin band);
        // once up, only a near overlap makes one give way
        if (clashes(spot, occupied, (g.side ? 4 : 2) * rem)) continue;
        return { ...placement, label, point, spot, index };
      }
    }
    return null;
  }

  function spawn(g: Geometry, now: number) {
    const c = cluster, life = still ? Infinity : TAG_LIFE;
    const taken = c.live.map((tg) => tg.label.text);
    if (!c.deck.length) deal(taken);
    const room = findRoom(g, taken, life);
    // when none of the labels left in the round has found room three times in a row, deal the next round behind them
    if (!room) {
      if (++c.stuck >= 3) {
        c.stuck = 0;
        deal(taken);
      }
      return;
    }
    const { label, spot, index, ...placement } = room;
    c.stuck = 0;
    c.deck.splice(index, 1);
    occupied.push(spot);
    const el = createTag(label.text);
    el.href = label.href;
    el.tabIndex = -1;
    layer.appendChild(el);
    // the label's square faces its particle
    el.classList.toggle('rev', placement.sgn < 0);
    // The leader keeps the direction it was given here: recomputing it from the particle's position swings the
    // label around when the particle passes near the centre of the cluster
    const tg: Tag = {
      ...placement, el, label, born: now, seen: now, hover: false, leaving: false,
      life: life + label.text.length * TAG_LIFE_PER_CHAR,
    };
    el.addEventListener('pointerenter', () => {
      tg.hover = true;
    });
    el.addEventListener('pointerleave', () => {
      tg.hover = false;
    });
    c.live.push(tg);
  }

  function clipTags() {
    if (!head) return;
    const top = Math.round(head.getBoundingClientRect().bottom);
    if (top !== clipTop) {
      clipTop = top;
      layer.style.clipPath = `inset(${top}px 0 0 0)`;
    }
  }

  function drawParticles(g: Geometry, disp: number, fade: number, T: number, nudge: number) {
    const c = cluster, R = g.R, F = R * 3.2;
    const cosTurn = Math.cos(c.turn), sinTurn = Math.sin(c.turn);
    const cosTilt = Math.cos(c.tilt), sinTilt = Math.sin(c.tilt);
    for (const accent of [false, true]) {
      ctx.fillStyle = accent ? col.accent : col.fg;
      for (const p of c.pts) {
        if (p.accent !== accent) continue;
        // organic surface: a few sines over the direction, drifting in time
        const k = 1 + 0.24 * Math.sin(p.x * 2.6 + T + SURFACE_PHASE) * Math.sin(p.y * 2.2 - T * 0.8)
          + 0.1 * Math.sin(p.z * 4 + T * 1.3 + SURFACE_PHASE);
        const e = 1 + disp * p.spread, j = disp * 0.9;
        const x = p.x * k * p.dist * e + p.scatterX * j;
        const y = p.y * k * p.dist * e + p.scatterY * j;
        const z = p.z * k * p.dist * e + p.scatterZ * j;
        const x1 = x * cosTurn + z * sinTurn, z1 = -x * sinTurn + z * cosTurn;
        const y2 = y * cosTilt - z1 * sinTilt, z2 = y * sinTilt + z1 * cosTilt;
        const persp = F / Math.max(F * 0.3, F + z2 * R);
        const bx = g.cx + x1 * R * persp, by = g.cy + y2 * R * persp;
        if (!still) {
          // the pointer nudges nearby particles aside
          let qx = bx - pointer.x, qy = by - pointer.y, push = 0;
          const qd = qx * qx + qy * qy;
          if (qd < PUSH_REACH * PUSH_REACH) {
            const qn = Math.sqrt(qd) || 1, f = 1 - qn / PUSH_REACH;
            push = f * f * 14;
            qx /= qn;
            qy /= qn;
          }
          p.pushX += (qx * push - p.pushX) * nudge;
          p.pushY += (qy * push - p.pushY) * nudge;
        }
        p.sx = bx + p.pushX;
        p.sy = by + p.pushY;
        // the half a particle is on (turnedX) tells if it turns toward the viewer: near the middle the surface
        // drift swamps the change in depth from one frame to the next
        p.turnedX = x1;
        p.front = (1 - z2) / 2;
        const fr = clamp(p.front, 0, 1);
        const a = (0.1 + 0.55 * fr) * (p.halo ? 0.32 / p.dist : p.shell ? 1 : 1.05) * (accent ? 1.4 : 1)
          * fade * col.boost;
        p.alpha = Math.min(1, a);
        if (a < 0.01) continue;
        const sz = (0.6 + 1.6 * fr) * (p.halo ? 0.75 : 1) * col.grow;
        if (p.star) {
          // the few bright particles: a round core with a faint halo, strongest at the front
          ctx.globalAlpha = p.alpha * (col.light ? 0.035 : 0.07);   // a grey smudge on light, so keep it faint
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 3 + 4 * fr, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = Math.min(1, a * 1.7);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 0.9 + 1.1 * fr, 0, TAU);
          ctx.fill();
          continue;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.sx - sz / 2, p.sy - sz / 2, sz, sz);
      }
    }
  }

  /** A faint ring around the particle, and a line from the ring to the centre of the label's square */
  function drawLeader(spot: Spot, alpha: number) {
    const dx = spot.x2 - spot.x1, dy = spot.y2 - spot.y1, d = Math.sqrt(dx * dx + dy * dy) || 1;
    lctx.lineWidth = 1;
    lctx.globalAlpha = alpha * 0.5;
    lctx.strokeStyle = col.accent;
    lctx.beginPath();
    lctx.arc(spot.x1, spot.y1, 5, 0, TAU);
    lctx.stroke();
    lctx.globalAlpha = alpha * 0.6;
    lctx.strokeStyle = col.fg;
    lctx.beginPath();
    lctx.moveTo(spot.x1 + dx / d * 5, spot.y1 + dy / d * 5);
    lctx.lineTo(spot.x2, spot.y2);
    lctx.stroke();
  }

  function drop(tg: Tag) {
    tg.el.remove();
    return false;
  }

  /** Moves, fades and draws one label; false once it is gone */
  function updateTag(tg: Tag, g: Geometry, disp: number, now: number, placed: Spot[]): boolean {
    if (tg.hover && now - tg.born > tg.life - 600) tg.born += now - tg.seen;   // hold while hovered
    tg.seen = now;
    const t0 = now - tg.born;
    if (t0 > tg.life) return drop(tg);
    const p = cluster.pts[tg.point];
    // Fade with the particle: full while it faces the viewer, gone by the time it reaches the rim.
    // Once it has started turning away the label only fades further, it never comes back.
    let face = 1;
    if (!still) {
      face = clamp((p.front - 0.5) / 0.25, 0, 1);
      if (tg.peak == null) tg.peak = face;
      if (face < tg.peak && p.turnedX * cluster.turnSpeed < 0) tg.leaving = true;
      if (tg.leaving) {
        tg.peak = Math.min(tg.peak, face);
        face = tg.peak;
      } else {
        tg.peak = Math.max(tg.peak, face);
      }
      if (face < 0.02) return drop(tg);
    }
    // A label on its way out (it would overlap another, hit a screen edge, or the cluster is being
    // spun) lets go of its particle: it stays where it is and fades, instead of being dragged along
    const spot = tg.frozen ? tg.frozen.spot : place(tg, p, g);
    if (!still && !tg.clashAt && (spot.pinned || clashes(spot, placed, 6))) tg.clashAt = now;
    const base = Math.min(1, t0 / 350, (tg.life - t0) / 450) * face;
    // freeze at what was on screen last frame: the particle may already have whipped round since
    if (tg.clashAt && !tg.frozen) tg.frozen = tg.last ?? { spot, alpha: base };
    if (!tg.frozen) tg.last = { spot, alpha: base };
    const gone = tg.clashAt ? 1 - (now - tg.clashAt) / 250 : 1;
    if (gone <= 0) return drop(tg);
    let a = still ? 1 : (tg.frozen ? tg.frozen.alpha : base) * gone;
    a *= Math.max(0, 1 - disp * 3);
    tg.el.classList.toggle('gone', a < 0.2);
    if (a > 0.05) placed.push(spot);
    // a detached label fades its ring and line twice as fast
    const la = tg.frozen ? a * Math.max(0, 2 * gone - 1) : a;
    if (la > 0.01) drawLeader(spot, la);
    tg.el.style.transform = `translate(${spot.x.toFixed(1)}px,${spot.y.toFixed(1)}px)`;
    tg.el.style.opacity = a.toFixed(3);
    return true;
  }

  function updateTags(g: Geometry, disp: number, gather: number, now: number, placed: Spot[]) {
    const c = cluster;
    // While the cluster is being dragged or is still spinning fast, labels would be whipped around
    // with their particles: let the current ones fade out and hold new ones until it settles
    const fast = !!drag || Math.abs(c.turnSpeed) > 0.008 || Math.abs(c.tiltSpeed) > 0.006;
    if (fast && !still) {
      c.live.forEach((tg) => {
        if (!tg.clashAt) tg.clashAt = now;
      });
      c.next = Math.max(c.next, now + 700);
    }
    const onStage = g.cy > 90 && g.cy < H - 60 && disp < 0.25 && !fast;
    if (!still && onStage && now > c.next && c.live.length < 2 && gather === 0) {
      spawn(g, now);
      c.next = now + (1700 + Math.random() * 1700) * (g.side ? 1 : 0.6);
    }
    if (still && onStage && !c.live.length) {
      spawn(g, now);
      spawn(g, now);
    }
    c.live = c.live.filter((tg) => updateTag(tg, g, disp, now, placed));
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
    ctx.clearRect(0, 0, W, H);
    lctx.clearRect(0, 0, W, H);
    const c = cluster;
    c.g = geometry();
    const g = c.g;
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
        c.turnSpeed += (SPIN * c.pace - c.turnSpeed) * ease(0.025);
        c.tiltSpeed += (0 - c.tiltSpeed) * ease(0.05);
        c.turn += c.turnSpeed * k60;
        c.tilt = clamp(c.tilt + c.tiltSpeed * k60, -TILT_MAX, TILT_MAX);
        c.tilt += (TILT_REST - c.tilt) * ease(0.008);
      }
      const fade = Math.pow(1 - disp, 1.6);
      if (fade > 0.01 || c.live.length) busy = true;
      drawParticles(g, disp, fade, still ? 0 : now * 0.00028, ease(0.15));
      updateTags(g, disp, gather, now, placed);
    }
    occupied = placed;
    ctx.globalAlpha = 1;
    // Keep looping only while the cluster is visible (or a tag is still up); scrolling back wakes it again
    if (!still && !document.hidden && (busy || drag)) raf = requestAnimationFrame(frame);
  }

  function draw() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function restart() {
    cancelAnimationFrame(raf);
    raf = 0;
    still = motionReduced();
    readColors();
    build();
    draw();
  }

  function recolor() {
    readColors();
    draw();
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
      const perPixel = DRAG_TURN * cluster.pace;
      cluster.turn -= dx * perPixel;
      cluster.tilt = clamp(cluster.tilt + dy * perPixel, -TILT_MAX, TILT_MAX);
      const t = performance.now();
      drag.samples.push({ t, dx, dy });
      while (drag.samples.length && t - drag.samples[0].t > FLICK_MS) drag.samples.shift();
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
    drag = { x: e.clientX, y: e.clientY, samples: [] };
    cluster.tiltSpeed = cluster.turnSpeed = 0;
    root.classList.add('dragging');
  });

  function endDrag() {
    if (!drag) return;
    // carry on with the speed of the drag's last FLICK_MS, as radians per 60 fps frame
    const now = performance.now(), recent = drag.samples.filter((q) => now - q.t <= FLICK_MS);
    if (recent.length) {
      let sx = 0, sy = 0;
      for (const q of recent) {
        sx += q.dx;
        sy += q.dy;
      }
      const span = Math.max(FRAME, now - recent[0].t), perPixel = DRAG_TURN * cluster.pace;
      cluster.turnSpeed = clamp(-sx / span * FRAME * perPixel, -FLICK_MAX, FLICK_MAX);
      cluster.tiltSpeed = clamp(sy / span * FRAME * perPixel, -FLICK_MAX, FLICK_MAX);
    } else {
      cluster.turnSpeed = cluster.tiltSpeed = 0;
    }
    drag = null;
    root.classList.remove('dragging');
    draw();
  }

  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  addEventListener('blur', endDrag);
  // pointerleave is dispatched to elements, not to the document: listen on the root element
  root.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = NO_POINTER;
  });
  addEventListener('scroll', draw, { passive: true });
  document.addEventListener('visibilitychange', draw);
  let rt: ReturnType<typeof setTimeout> | undefined, lastW = innerWidth;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (innerWidth !== lastW || innerWidth >= WIDE) {
        lastW = innerWidth;
        restart();
      }
    }, 150);
  });
  new MutationObserver(recolor).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(restart).observe(root, { attributes: true, attributeFilter: ['data-text'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolor);
  // The Display panel's motion setting and the OS setting both restart it (still or animated)
  new MutationObserver(restart).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', restart);
  restart();
}

/** A label in the background jumps to the row it names and lights it up (see jump.ts) */
export function initTagLinks(): void {
  const layer = document.getElementById('tags');
  if (!layer) return;
  layer.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a.tag') : null;
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById((a.getAttribute('href') ?? '').slice(1));
    if (target) jumpTo(target);
  });
}
