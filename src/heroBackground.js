// Animated homepage hero background, drawn on a <canvas> in code.
//
// Why code instead of a stock video: a video file would add 2–10 MB to the
// homepage and slow down the first paint (bad for Google's page-speed
// signals). This whole effect is a few KB, has no licence to track, scales
// sharply to any screen, and matches the brand colours exactly.
//
// Variants:
//   "combo"  – rising chart lines + a few drifting maple leaves (default)
//   "chart"  – rising chart lines over a faint grid only
//   "leaves" – drifting maple leaves only
//   "ticker" – faint rising candlesticks + a slow tape of account names
//
// Motion rules: nothing moves for visitors who ask for reduced motion, or on
// small screens (phones get one still frame to save battery). The loop also
// pauses whenever the hero is scrolled out of view or the tab is hidden.

export const HERO_BG_VARIANTS = ["combo", "chart", "leaves", "ticker"];

const RED = [204, 0, 0];
const RED_SOFT = [248, 113, 113];
const GRAY = [143, 143, 141];

// Flag-style maple leaf with a stem, in a 100×100 box.
const LEAF_PATH = "M50 2L58 18L66 13L63 38L76 24L80 32L92 29L88 44L96 48L74 66L77 74L54 71L54 94L46 94L46 71L23 74L26 66L4 48L12 44L8 29L20 32L24 24L37 38L34 13L42 18Z";

const TAPE_WORDS = [
  "TFSA", "RRSP", "FHSA", "RESP", "Spousal RRSP", "Margin", "ACB",
  "CESG", "Dividends", "Capital gains", "CAD + USD", "Contribution room",
  "Withholding tax", "Live prices",
];

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Small seeded random so the still frame looks the same on every visit.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Upward-drifting random walk, values roughly 0..1 (0 = bottom).
function makeWalk(rand, n, start, drift, vol) {
  const pts = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v += drift + (rand() - 0.5) * vol;
    v = Math.max(0.05, Math.min(0.95, v));
    pts.push(v);
  }
  return pts;
}

export function startHeroBackground(canvas, variant = "combo") {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const rand = rng(20261123);
  const leafPath = typeof Path2D !== "undefined" ? new Path2D(LEAF_PATH) : null;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia?.("(max-width: 640px)").matches;
  const animate = !reduceMotion && !small;

  const showChart = variant === "combo" || variant === "chart";
  const showLeaves = variant === "combo" || variant === "leaves";
  const showTicker = variant === "ticker";

  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  // ---- chart lines -------------------------------------------------------
  // Each line is a long random walk that scrolls slowly right-to-left; we
  // draw a window of it, and the walk wraps so it never runs out.
  const SEG = 160;
  const lines = [
    { pts: makeWalk(rand, SEG, 0.18, 0.0035, 0.05), col: RED, a: 0.55, w: 2.2, glow: true, speed: 9 },
    { pts: makeWalk(rand, SEG, 0.30, 0.0025, 0.06), col: GRAY, a: 0.22, w: 1.4, speed: 6 },
    { pts: makeWalk(rand, SEG, 0.10, 0.0030, 0.045), col: RED_SOFT, a: 0.18, w: 1.2, speed: 4.5 },
  ];
  // Re-centre each walk so wrapping from end to start doesn't jump.
  lines.forEach((l) => {
    const first = l.pts[0], last = l.pts[SEG - 1];
    l.pts = l.pts.map((v, i) => v - (last - first) * (i / (SEG - 1)) + (last - first) * 0.5 - 0.1);
    // gentle overall upward slope is added at draw time instead
  });

  // ---- leaves -------------------------------------------------------------
  const leafCount = variant === "leaves" ? 16 : 8;
  const leaves = Array.from({ length: leafCount }, () => ({
    x: rand(), y: rand(),
    s: 22 + rand() * 40,               // size in px
    a: 0.07 + rand() * 0.11,           // opacity (kept faint)
    vy: 6 + rand() * 10,               // px/sec downward drift
    vx: -4 + rand() * 8,
    rot: rand() * Math.PI * 2,
    vr: (rand() - 0.5) * 0.5,
    sway: rand() * Math.PI * 2,
  }));

  // ---- candles (ticker variant) -------------------------------------------
  const candles = makeWalk(rand, 90, 0.25, 0.006, 0.09);

  let t0 = performance.now();
  let raf = 0, running = false, visible = true;

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;
    const step = 64;
    ctx.beginPath();
    for (let x = 0; x <= W; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();
  }

  function drawLines(t) {
    const cols = Math.max(16, Math.min(48, Math.round(W / 30))); // points across the screen
    const dx = W / (cols - 1);
    lines.forEach((l) => {
      const off = (t * l.speed) / dx; // points scrolled so far
      const base = Math.floor(off);
      const frac = off - base;
      const yAt = (i) => {
        const v = l.pts[(base + i) % SEG];
        // Tilt upward left-to-right so the picture always reads "growth".
        const tilt = (i / (cols - 1)) * 0.35;
        return H * (1 - (0.12 + (v + tilt) * 0.62));
      };
      ctx.beginPath();
      for (let i = 0; i <= cols; i++) {
        const x = (i - frac) * dx;
        const y = yAt(i);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      if (l.glow) {
        // soft fill under the main line
        ctx.save();
        ctx.lineTo(W + dx, H); ctx.lineTo(-dx, H); ctx.closePath();
        const g = ctx.createLinearGradient(0, H * 0.2, 0, H);
        g.addColorStop(0, rgba(RED, 0.10));
        g.addColorStop(1, rgba(RED, 0));
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const x = (i - frac) * dx;
          i === 0 ? ctx.moveTo(x, yAt(i)) : ctx.lineTo(x, yAt(i));
        }
        ctx.shadowColor = rgba(RED, 0.6);
        ctx.shadowBlur = 14;
      }
      ctx.strokeStyle = rgba(l.col, l.a);
      ctx.lineWidth = l.w;
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawLeaves(t, dt) {
    if (!leafPath) return;
    leaves.forEach((p) => {
      if (animate) {
        p.y += (p.vy * dt) / H;
        p.x += ((p.vx + Math.sin(t * 0.6 + p.sway) * 8) * dt) / W;
        p.rot += p.vr * dt;
        if (p.y > 1.08) { p.y = -0.08; p.x = rand(); }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
      }
      ctx.save();
      ctx.translate(p.x * W, p.y * H);
      ctx.rotate(p.rot);
      const k = p.s / 100;
      ctx.scale(k, k);
      ctx.translate(-50, -50);
      ctx.fillStyle = rgba(RED, p.a);
      ctx.fill(leafPath);
      ctx.restore();
    });
  }

  function drawCandles(t) {
    const n = 36;
    const cw = W / n;
    const off = ((t * 6) / cw);
    const base = Math.floor(off), frac = off - base;
    for (let i = 0; i <= n; i++) {
      const k = (base + i) % candles.length;
      const prev = k === 0 ? candles[0] : candles[k - 1];
      const cur = candles[k];
      const tilt = (i / n) * 0.3;
      const o = H * (1 - (0.15 + (prev + tilt) * 0.55));
      const c = H * (1 - (0.15 + (cur + tilt) * 0.55));
      const up = cur >= prev;
      const x = (i - frac) * cw + cw * 0.3;
      const col = up ? RED_SOFT : GRAY;
      ctx.strokeStyle = rgba(col, 0.16);
      ctx.beginPath();
      ctx.moveTo(x + cw * 0.2, Math.min(o, c) - 10);
      ctx.lineTo(x + cw * 0.2, Math.max(o, c) + 10);
      ctx.stroke();
      ctx.fillStyle = rgba(col, up ? 0.16 : 0.1);
      ctx.fillRect(x, Math.min(o, c), cw * 0.4, Math.max(2, Math.abs(c - o)));
    }
  }

  function drawTape(t) {
    ctx.font = "600 13px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textBaseline = "middle";
    const y = 20;
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.fillRect(0, y - 16, W, 32);
    const items = TAPE_WORDS.map((w) => "▲ " + w);
    const widths = items.map((s) => ctx.measureText(s).width + 42);
    const total = widths.reduce((a, b) => a + b, 0);
    let x = -((t * 28) % total);
    while (x < W) {
      for (let i = 0; i < items.length && x < W; i++) {
        ctx.fillStyle = rgba(RED_SOFT, 0.32);
        ctx.fillText("▲", x, y);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillText(items[i].slice(2), x + 16, y);
        x += widths[i];
      }
    }
  }

  function drawVignette() {
    // Darken the middle so the headline always stays easy to read.
    const g = ctx.createRadialGradient(W / 2, H * 0.32, 0, W / 2, H * 0.32, Math.max(W, H) * 0.6);
    g.addColorStop(0, "rgba(19,19,18,0.72)");
    g.addColorStop(0.55, "rgba(19,19,18,0.35)");
    g.addColorStop(1, "rgba(19,19,18,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // fade into the page at the bottom
    const b = ctx.createLinearGradient(0, H * 0.7, 0, H);
    b.addColorStop(0, "rgba(19,19,18,0)");
    b.addColorStop(1, "rgba(19,19,18,1)");
    ctx.fillStyle = b;
    ctx.fillRect(0, H * 0.7, W, H * 0.3);
  }

  let last = t0;
  function frame(now) {
    const t = (now - t0) / 1000;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, W, H);
    if (showChart) { drawGrid(); drawLines(t); }
    if (showTicker) { drawGrid(); drawCandles(t); }
    if (showLeaves) drawLeaves(t, dt);
    drawVignette();
    if (showTicker) drawTape(t);
    if (running) raf = requestAnimationFrame(frame);
  }

  const start = () => {
    if (running || !animate || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  // Always paint one frame right away (this is the still image for phones
  // and reduced-motion visitors).
  frame(t0 + 12000);

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); })
    : null;
  io?.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  const onResize = () => { resize(); if (!running) frame(performance.now()); };
  window.addEventListener("resize", onResize);
  start();

  return () => {
    stop();
    io?.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("resize", onResize);
  };
}
