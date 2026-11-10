import { jumpTo } from './jump';
import { motionReduced } from './store';

// Background: a slowly turning cluster of particles behind the hero. Now and then a tag comes out of it on a
// short leader line, naming a skill, a result, a past role or a project.
export function initParticles(data) {
  var root = document.documentElement;
  var canvas = document.getElementById('bg'), layer = document.getElementById('tags'), lines = document.getElementById('lines');
  var lctx = lines.getContext && lines.getContext('2d');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx || !lctx) return;
  var W = 0, H = 0, wide = false, rem = 16, born = 0, raf = 0, still = false, col = {}, last = 0;
  var pointer = { x: -1e4, y: -1e4 }, drag = null;
  // Anchored to the hero (#top); its labels come from Particles.astro
  var CLUSTERS = [{ id: 'top', seed: 1.3, tags: function () { return data.top } }];
  function readColors() {
    var cs = getComputedStyle(root);
    col.fg = cs.getPropertyValue('--fg').trim(); col.accent = cs.getPropertyValue('--accent').trim();
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(cs.getPropertyValue('--bg').trim());
    col.light = m ? (parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114) > 140 : false;
    col.boost = col.light ? 1.55 : 1; col.grow = col.light ? 1.2 : 1;
  }
  function unit() { var t = Math.random() * 6.2832, z = Math.random() * 2 - 1, r = Math.sqrt(1 - z * z); return [Math.cos(t) * r, Math.sin(t) * r, z]; }
  function makePoints(n) {
    // A few lobes make the outline lumpy instead of a perfect sphere
    var lobes = [unit(), unit(), unit()], pts = [];
    for (var i = 0; i < n; i++) {
      var d = unit(), L = lobes[i % 3], pull = Math.random() * 0.45;
      var x = d[0] + L[0] * pull, y = d[1] + L[1] * pull, z = d[2] + L[2] * pull, m = Math.sqrt(x * x + y * y + z * z);
      x /= m; y /= m; z /= m;
      var kind = Math.random(), shell = kind < 0.4, halo = kind > 0.72;
      // shell: a soft band near the surface; core: denser toward the middle;
      // halo: a thinning fringe out to ~2.3R so the cluster fades into the page instead of ending at an edge
      var s = shell ? 0.86 + Math.random() * 0.14 : halo ? 1.04 + Math.pow(Math.random(), 1.8) * 1.25 : Math.pow(Math.random(), 0.95) * 0.8;
      var star = Math.random() < 0.035;
      var j = unit();
      pts.push({ x: x, y: y, z: z, s: s, shell: shell, halo: halo, star: star && !halo, a: star ? Math.random() < 0.5 : Math.random() < 0.07,
        sx: 0, sy: 0, front: 0, ox: 0, oy: 0, spread: 0.8 + Math.random() * 2.8, jx: j[0], jy: j[1], jz: j[2] });
    }
    return pts;
  }
  function clearTags() { CLUSTERS.forEach(function (c) { (c.live || []).forEach(function (g) { g.el.remove() }); c.live = []; }); }
  function build() {
    sizes = {};
    var dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; wide = W >= 1024;
    rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lines.width = canvas.width; lines.height = canvas.height; lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clearTags();
    CLUSTERS.forEach(function (c) {
      var n = wide ? 4500 : W < 640 ? 1200 : 2400;
      if (!c.pts || c.pts.length !== n) c.pts = makePoints(n);   // same cloud across theme, text size and language changes
      c.next = performance.now() + 1500;
      c.deck = c.deck || []; c.stuck = 0;
      if (c.ay == null) { c.ay = c.seed; c.ax = -0.25; c.vy = 0; c.vx = 0; }
    });
  }
  function geometry(c) {
    var sec = document.getElementById(c.id); if (!sec) return null;
    var r = sec.getBoundingClientRect();
    // Sized by the width alone: bound to the height, it would be a small ball over the name on short screens.
    // The 52rem cap keeps it around the column on wide screens.
    var role = sec.querySelector('[data-role]'), roof = role ? role.getBoundingClientRect().top - 10 : r.top + 214;
    var g = { cx: W / 2, cy: roof, R: Math.min(W * 0.55, 52 * rem), side: 0, minX: 12, maxX: W - 12, maxY: roof };
    // Labels go where there is no text: right of the hero text on wide screens, above the role line on narrow ones
    if (wide) {
      var colW = Math.min(W - 32, 64 * rem), textRight = (W - colW) / 2 + Math.min(colW, 38 * rem);
      g.side = 1; g.minX = textRight + 16; g.maxX = Math.min(W - 12, textRight + 40 * rem); g.maxY = r.bottom;
    }
    return g;
  }
  // Areas taken by labels and their lines last frame, plus labels spawned in this one (without motion two
  // spawn in the same frame), so a new label never lands on (or draws across) another
  var occupied = [];
  function overlap(a, b, pad) { return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y; }
  function crosses(s, r, pad) {
    for (var k = 0; k <= 12; k++) { var x = s.x1 + (s.x2 - s.x1) * k / 12, y = s.y1 + (s.y2 - s.y1) * k / 12;
      if (x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad) return true; }
    return false;
  }
  function clashes(o, list, gap) {
    return list.some(function (q) { return overlap(o, q, gap) || crosses(o, q, gap / 2) || crosses(q, o, gap / 2); });
  }
  // where a label sits for a particle, and the line from the particle to the label's square
  function place(tg, p, g) {
    // The leader keeps the direction it was given at spawn: recomputing it from the particle's position
    // swings the label around when the particle passes near the centre of the cluster
    var L = tg.L || leader(g, p), ex = p.sx + L.x * tg.len, ey = p.sy + L.y * tg.len;
    var lx0 = tg.sgn > 0 ? ex : ex - tg.w, ly0 = ey - tg.h / 2;
    var lx = Math.max(g.minX, Math.min(g.maxX - tg.w, lx0)), ly = Math.max(8, Math.min(Math.min(H - 8, g.maxY) - tg.h, ly0));
    // ends on the centre of the square, which straddles the label's near border
    var nx = tg.sgn > 0 ? lx - 0.5 : lx + tg.w + 0.5, ny = ly + tg.h / 2;
    return { x: lx, y: ly, w: tg.w, h: tg.h, x1: p.sx, y1: p.sy, x2: nx, y2: ny, pinned: Math.abs(lx - lx0) > 0.5 || Math.abs(ly - ly0) > 0.5 };
  }
  // Leader direction for a particle: outward from the centre, bent toward the cluster's open side
  function leader(g, p) {
    var dx = p.sx - g.cx, dy = p.sy - g.cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
    dx = dx / d * 0.75 + g.side * 0.25; dy /= d;
    var n = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: dx / n, y: dy / n };
  }
  // Label sizes, measured once per text (cleared on rebuild, since the text size setting changes them)
  var sizes = {};
  function measure(text) {
    if (!sizes[text]) {
      var m = document.createElement('a'); m.className = 'tag'; m.textContent = text; m.style.visibility = 'hidden';
      layer.appendChild(m); sizes[text] = { w: m.offsetWidth, h: m.offsetHeight }; m.remove();
    }
    return sizes[text];
  }
  // Labels are dealt from a shuffled deck: each one comes up once per round, in a new order every round.
  // The labels still on screen go at the end of a new round, so none comes back right away.
  function deal(c, taken) {
    var round = c.tags().filter(function (x) { return c.deck.indexOf(x) < 0 });
    for (var i = round.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = round[i]; round[i] = round[j]; round[j] = t; }
    c.deck = c.deck.concat(round.filter(function (x) { return taken.indexOf(x.text) < 0 }), round.filter(function (x) { return taken.indexOf(x.text) >= 0 }));
  }
  function spawn(c, g, now, life) {
    var a, item, w, h, len, cand = -1, sgn = 1, spot, pick = -1;
    var taken = c.live.map(function (x) { return x.el.textContent });
    var top = document.querySelector('.sticky-head').getBoundingClientRect().bottom + 8;
    if (!c.deck.length) deal(c, taken);
    // A label that finds no room keeps its place at the front of the deck, so it is tried first next time
    // instead of waiting a whole round
    for (var d = 0; d < c.deck.length && cand < 0; d++) {
      item = c.deck[d];
      if (taken.indexOf(item.text) >= 0) continue;
      var size = measure(item.text);
      w = size.w; h = size.h; len = 30 + Math.random() * 30;
      // how far the label is carried before it goes: on the front face particles move against the spin, about
      // R × vy a frame
      var drift = still ? 0 : -c.vy * g.R * (life + item.text.length * 70) / 16.667;
      for (var k = 0; k < 160 && cand < 0; k++) {
        var i = Math.floor(Math.random() * c.pts.length), p = c.pts[i];
        // drawn clearly, on the front face, on the cluster's open side and on the half still turning toward
        // the viewer, so the label gets a long run before it has to go
        if (!p.shell || p.vis < 0.4 || p.front < 0.82 || (!still && p.rx * c.vy <= 0) || (g.side && (p.sx - g.cx) * g.side < g.R * 0.12)) continue;
        var L = leader(g, p), ex = p.sx + L.x * len, ey = p.sy + L.y * len;
        var sg = L.x >= 0 ? 1 : -1, lx = sg > 0 ? ex : ex - w;
        // a label too long for the open side hangs the other way from a steep leader, clear of its particle
        if ((lx < g.minX || lx + w > g.maxX) && Math.abs(L.x) < 0.5) { sg = -sg; lx = sg > 0 ? ex : ex - w; }
        if (!(Math.min(lx, lx + drift) >= g.minX && Math.max(lx, lx + drift) + w <= g.maxX && ey - h / 2 > top && ey + h / 2 < Math.min(H - 12, g.maxY))) continue;
        var probe = place({ len: len, sgn: sg, w: w, h: h }, p, g);
        // a new label starts well clear of the others (closer on narrow screens, where labels share a thin band);
        // once up, only a near overlap makes one give way
        if (clashes(probe, occupied, (g.side ? 4 : 2) * rem)) continue;
        cand = i; sgn = sg; spot = probe; pick = d;
      }
    }
    // when none of the labels left in the round has found room three times in a row, deal the next round behind them
    if (cand < 0) { if (++c.stuck >= 3) { c.stuck = 0; deal(c, taken); } return; }
    c.stuck = 0;
    c.deck.splice(pick, 1);
    occupied.push(spot);
    a = document.createElement('a'); a.className = 'tag'; a.textContent = item.text; a.href = item.href; a.tabIndex = -1;
    layer.appendChild(a);
    // the label's square faces its particle; longer labels stay up longer
    a.classList.toggle('rev', sgn < 0);
    var tg = { el: a, p: cand, L: leader(g, c.pts[cand]), born: now, life: life === Infinity ? life : life + item.text.length * 70, w: w, h: h, len: len, sgn: sgn, hover: false };
    a.addEventListener('pointerenter', function () { tg.hover = true });
    a.addEventListener('pointerleave', function () { tg.hover = false });
    c.live.push(tg);
  }
  // Labels are cut off below the sticky header: where they sit above it they would cover it, elsewhere they
  // would show through it
  var head = document.querySelector('.sticky-head');
  var clipTop = -1;
  function clipTags() {
    if (!head) return;
    var top = Math.round(head.getBoundingClientRect().bottom);
    if (top !== clipTop) { clipTop = top; layer.style.clipPath = 'inset(' + top + 'px 0 0 0)'; }
  }
  function frame(now) {
    clipTags();
    raf = 0;
    if (!born) born = now;
    var age = now - born, busy = false, placed = [];
    // All motion is scaled to a 60 fps frame, so a 120 Hz screen turns the cluster at the same speed
    var dt = Math.min(64, last ? now - last : 16.667), k60 = dt / 16.667; last = now;
    var ease = function (r) { return 1 - Math.pow(1 - r, k60); };   // per-frame lerp factor r at 60 fps
    var nudge = ease(0.15);
    ctx.clearRect(0, 0, W, H); lctx.clearRect(0, 0, W, H);
    CLUSTERS.forEach(function (c) {
      var g = c.g = geometry(c);
      // off screen: its labels are not needed any more (and an invisible label must not catch clicks)
      if (!g || g.cy + g.R < -120 || g.cy - g.R > H + 120) { (c.live || []).forEach(function (x) { x.el.remove() }); c.live = []; return; }
      // On load the cluster starts as scattered as it gets on scroll and comes together: 1 at first, easing to 0
      var gather = still ? 0 : Math.pow(1 - Math.min(1, age / 2000), 3);
      // Dispersion: 0 at the top of the page, rising to 1 as the hero scrolls away
      var off = Math.max(0, scrollY / (H * 0.55));
      var target = Math.min(1, off); target = target * target * (3 - 2 * target);
      // eased toward the scroll position, so a notched mouse wheel does not make the particles jump
      c.disp = still || c.disp == null ? target : c.disp + (target - c.disp) * ease(0.16);
      var disp = Math.max(c.disp, gather);
      if (Math.abs(target - disp) > 0.002) busy = true;
      // A big cloud turns (and is dragged) at the surface speed of a 320px one, so its labels stay readable
      c.pace = Math.min(1, 320 / g.R);
      if (!still && !(drag && drag.c === c)) {
        // after a drag the spin carries on and eases back to the slow idle turn
        c.vy += (0.0022 * c.pace - c.vy) * ease(0.025); c.vx += (0 - c.vx) * ease(0.05);
        c.ay += c.vy * k60; c.ax = Math.max(-1.3, Math.min(1.3, c.ax + c.vx * k60)); c.ax += (-0.25 - c.ax) * ease(0.008);
      }
      var ay = c.ay, ax = c.ax;
      var cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax), T = still ? 0 : now * 0.00028;
      var fade = Math.pow(1 - disp, 1.6);
      if (fade > 0.01 || c.live.length) busy = true;
      var R = g.R, F = R * 3.2;
      for (var pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? col.accent : col.fg;
        for (var i = 0; i < c.pts.length; i++) {
          var p = c.pts[i];
          if (p.a !== !!pass) continue;
          // organic surface: a few sines over the direction, drifting in time
          var k = 1 + 0.24 * Math.sin(p.x * 2.6 + T + c.seed) * Math.sin(p.y * 2.2 - T * 0.8) + 0.1 * Math.sin(p.z * 4 + T * 1.3 + c.seed);
          var e = 1 + disp * p.spread, j = disp * 0.9;
          var x = p.x * k * p.s * e + p.jx * j, y = p.y * k * p.s * e + p.jy * j, z = p.z * k * p.s * e + p.jz * j;
          var x1 = x * cyA + z * syA, z1 = -x * syA + z * cyA;
          var y2 = y * cxA - z1 * sxA, z2 = y * sxA + z1 * cxA;
          var persp = F / Math.max(F * 0.3, F + z2 * R);
          var bx = g.cx + x1 * R * persp, by = g.cy + y2 * R * persp;
          if (!still) {
            // the pointer nudges nearby particles aside
            var qx = bx - pointer.x, qy = by - pointer.y, qd = qx * qx + qy * qy, push = 0;
            if (qd < 4900) { var qn = Math.sqrt(qd) || 1, f = 1 - qn / 70; push = f * f * 14; qx /= qn; qy /= qn; }
            p.ox += (qx * push - p.ox) * nudge; p.oy += (qy * push - p.oy) * nudge;
          }
          p.sx = bx + p.ox; p.sy = by + p.oy;
          // the half a particle is on (rx) tells if it turns toward the viewer: near the middle the surface
          // drift swamps the change in depth from one frame to the next
          p.rx = x1; p.front = (1 - z2) / 2;
          var fr = Math.max(0, Math.min(1, p.front));
          var a = (0.1 + 0.55 * fr) * (p.halo ? 0.32 / p.s : p.shell ? 1 : 1.05) * (pass ? 1.4 : 1) * fade * col.boost;
          p.vis = Math.min(1, a);
          if (a < 0.01) continue;
          var sz = (0.6 + 1.6 * fr) * (p.halo ? 0.75 : 1) * col.grow;
          if (p.star) {
            // the few bright particles: a round core with a faint halo, strongest at the front
            ctx.globalAlpha = p.vis * (col.light ? 0.035 : 0.07);   // a grey smudge on light, so keep it faint
            ctx.beginPath(); ctx.arc(p.sx, p.sy, 3 + 4 * fr, 0, 6.2832); ctx.fill();
            ctx.globalAlpha = Math.min(1, a * 1.7);
            ctx.beginPath(); ctx.arc(p.sx, p.sy, 0.9 + 1.1 * fr, 0, 6.2832); ctx.fill();
            continue;
          }
          ctx.globalAlpha = p.vis;
          ctx.fillRect(p.sx - sz / 2, p.sy - sz / 2, sz, sz);
        }
      }
      // While the cluster is being dragged or is still spinning fast, labels would be whipped around
      // with their particles: let the current ones fade out and hold new ones until it settles
      var fast = (drag && drag.c === c) || Math.abs(c.vy) > 0.008 || Math.abs(c.vx) > 0.006;
      if (fast && !still) { c.live.forEach(function (tg) { if (!tg.clash) tg.clash = now }); c.next = Math.max(c.next, now + 700); }
      var onStage = g.cy > 90 && g.cy < H - 60 && disp < 0.25 && !fast;
      if (!still && onStage && now > c.next && c.live.length < 2 && gather === 0) { spawn(c, g, now, 3600); c.next = now + (1700 + Math.random() * 1700) * (g.side ? 1 : 0.6); }
      if (still && onStage && !c.live.length) { spawn(c, g, now, Infinity); spawn(c, g, now, Infinity); }
      c.live = c.live.filter(function (tg) {
        var t0 = now - tg.born;
        if (tg.hover && t0 > tg.life - 600) tg.born += now - (tg.seen || now);   // hold while hovered
        tg.seen = now; t0 = now - tg.born;
        if (t0 > tg.life) { tg.el.remove(); return false; }
        var p = c.pts[tg.p];
        // Fade with the particle: full while it faces the viewer, gone by the time it reaches the rim.
        // Once it has started turning away the label only fades further, it never comes back.
        var face = Math.max(0, Math.min(1, (p.front - 0.5) / 0.25));
        if (!still) {
          if (tg.peak == null) tg.peak = face;
          if (face < tg.peak && p.rx * c.vy < 0) tg.leaving = true;
          if (tg.leaving) { tg.peak = Math.min(tg.peak, face); face = tg.peak; } else tg.peak = Math.max(tg.peak, face);
        } else face = 1;
        if (!still && face < 0.02) { tg.el.remove(); return false; }
        // A label on its way out (it would overlap another, hit a screen edge, or the cluster is being
        // spun) lets go of its particle: it stays where it is and fades, instead of being dragged along
        var spot = tg.frozen || place(tg, p, g);
        if (tg.frozen) spot = tg.frozen;
        if (!still && !tg.clash && (spot.pinned || clashes(spot, placed, 6))) tg.clash = now;
        var base = Math.min(1, t0 / 350, (tg.life - t0) / 450) * face;
        // freeze at what was on screen last frame: the particle may already have whipped round since
        if (tg.clash && !tg.frozen) { tg.frozen = tg.lastSpot || spot; tg.fa = tg.lastBase != null ? tg.lastBase : base; }
        if (!tg.frozen) { tg.lastSpot = spot; tg.lastBase = base; }
        var gone = tg.clash ? 1 - (now - tg.clash) / 250 : 1;
        if (gone <= 0) { tg.el.remove(); return false; }
        var a = still ? 1 : (tg.frozen ? tg.fa : base) * gone;
        a *= Math.max(0, 1 - disp * 3);
        tg.el.classList.toggle('gone', a < 0.2);
        if (a > 0.05) placed.push(spot);
        // a faint ring around the particle, and a line from the ring to the centre of the label's square
        // (a detached label fades them twice as fast)
        var la = tg.frozen ? a * Math.max(0, 2 * gone - 1) : a;
        if (la > 0.01) {
          var dx = spot.x2 - spot.x1, dy = spot.y2 - spot.y1, d = Math.sqrt(dx * dx + dy * dy) || 1;
          lctx.lineWidth = 1;
          lctx.globalAlpha = la * 0.5; lctx.strokeStyle = col.accent;
          lctx.beginPath(); lctx.arc(spot.x1, spot.y1, 5, 0, 6.2832); lctx.stroke();
          lctx.globalAlpha = la * 0.6; lctx.strokeStyle = col.fg;
          lctx.beginPath(); lctx.moveTo(spot.x1 + dx / d * 5, spot.y1 + dy / d * 5); lctx.lineTo(spot.x2, spot.y2); lctx.stroke();
        }
        tg.el.style.transform = 'translate(' + spot.x.toFixed(1) + 'px,' + spot.y.toFixed(1) + 'px)';
        tg.el.style.opacity = a.toFixed(3);
        return true;
      });
    });
    occupied = placed;
    ctx.globalAlpha = 1;
    // Keep looping only while a cluster is visible (or a tag is still up); scrolling back wakes it again
    if (!still && !document.hidden && (busy || drag)) raf = requestAnimationFrame(frame);
  }
  function draw() { if (!raf) raf = requestAnimationFrame(frame); }
  function restart(replay) {
    cancelAnimationFrame(raf); raf = 0;
    still = motionReduced(); readColors();
    if (replay) born = 0;
    build(); draw();
  }
  // Drag anywhere on a cluster to turn it. Controls keep working, and a press right on a line of text still
  // selects it: what counts is the glyphs under the pointer, not the (often much wider) element boxes.
  var NOGRAB = 'a,button,input,select,textarea,label,summary,.tag,[contenteditable]';
  function overText(x, y) {
    var node, off;
    if (document.caretPositionFromPoint) { var cp = document.caretPositionFromPoint(x, y); if (cp) { node = cp.offsetNode; off = cp.offset; } }
    else if (document.caretRangeFromPoint) { var cr = document.caretRangeFromPoint(x, y); if (cr) { node = cr.startContainer; off = cr.startOffset; } }
    if (!node || node.nodeType !== 3 || !node.length) return false;
    var r = document.createRange();
    for (var i = Math.max(0, off - 1); i <= Math.min(node.length - 1, off); i++) {
      r.setStart(node, i); r.setEnd(node, i + 1);
      var b = r.getBoundingClientRect();
      if (x >= b.left - 2 && x <= b.right + 2 && y >= b.top - 2 && y <= b.bottom + 2) return true;
    }
    return false;
  }
  function canGrab(e) { return !(e.target.closest && e.target.closest(NOGRAB)) && !overText(e.clientX, e.clientY); }
  function hit(x, y) {
    for (var i = 0; i < CLUSTERS.length; i++) {
      // a cluster that has scattered on scroll is not there any more, even though its last position is kept
      var c = CLUSTERS[i], g = c.g;
      if (g && (c.disp == null || c.disp < 0.5) && Math.hypot(x - g.cx, y - g.cy) < g.R * 1.15) return c;
    }
    return null;
  }
  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    if (drag) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
      var c = drag.c, turn = 0.008 * c.pace;
      c.ay -= dx * turn; c.ax = Math.max(-1.3, Math.min(1.3, c.ax + dy * turn));
      var tnow = performance.now(); drag.s.push({ t: tnow, dx: dx, dy: dy });
      while (drag.s.length && tnow - drag.s[0].t > 80) drag.s.shift();
    } else {
      root.classList.toggle('grab', !still && !!hit(e.clientX, e.clientY) && canGrab(e));
    }
    pointer.x = e.clientX; pointer.y = e.clientY;
  }, { passive: true });
  addEventListener('pointerdown', function (e) {
    if (still || e.pointerType !== 'mouse' || e.button !== 0) return;
    var c = hit(e.clientX, e.clientY); if (!c || !canGrab(e)) return;
    e.preventDefault();
    drag = { c: c, x: e.clientX, y: e.clientY, s: [] }; c.vx = c.vy = 0;
    root.classList.add('dragging');
  });
  function endDrag() {
    if (!drag) return;
    // carry on with the speed of the last 80ms, as radians per 60 fps frame
    var tnow = performance.now(), s = drag.s.filter(function (q) { return tnow - q.t <= 80 }), sx = 0, sy = 0;
    s.forEach(function (q) { sx += q.dx; sy += q.dy });
    var span = s.length ? Math.max(16.667, tnow - s[0].t) : 1, turn = 0.008 * drag.c.pace;
    var cap = function (v) { return Math.max(-0.05, Math.min(0.05, v)) };   // a hard flick still settles gracefully
    drag.c.vy = s.length ? cap(-sx / span * 16.667 * turn) : 0; drag.c.vx = s.length ? cap(sy / span * 16.667 * turn) : 0;
    drag = null; root.classList.remove('dragging'); draw();
  }
  addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag); addEventListener('blur', endDrag);
  // pointerleave is dispatched to elements, not to the document: listen on the root element
  root.addEventListener('pointerleave', function () { pointer.x = pointer.y = -1e4; });
  addEventListener('scroll', draw, { passive: true });
  document.addEventListener('visibilitychange', draw);
  var rt, lastW = innerWidth;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (innerWidth !== lastW || innerWidth >= 1024) { lastW = innerWidth; restart(false); } }, 150);
  });
  new MutationObserver(function () { readColors(); draw(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(function () { restart(false); }).observe(root, { attributes: true, attributeFilter: ['data-text'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { readColors(); draw(); });
  // The Display panel's motion setting and the OS setting both restart it (still or animated)
  new MutationObserver(function () { restart(false); }).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function () { restart(false); });
  restart(true);
}

/** A label in the background jumps to the row it names and lights it up (see jump.ts) */
export function initTagLinks() {
  const layer = document.getElementById('tags');
  if (!layer) return;
  layer.addEventListener('click', (e) => {
    const a = e.target.closest('a.tag');
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) jumpTo(target);
  });
}
