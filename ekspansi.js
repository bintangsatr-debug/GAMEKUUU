'use strict';

// ===== EKSPANSI: LEVEL 11-15 + PETA HALAMAN 3 =====
// Dimuat PALING AKHIR (setelah game.js, spin.js, cheat.js, cutscene.js, about.js).
// Tidak perlu mengedit game.js.

// ---------- 1. DATA LEVEL (dibuat otomatis agar selalu bisa dilewati) ----------
function xpGen(o) {
  let s = o.seed * 7919; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
  const g = [], p = [], e = [], lastGap = o.boss ? o.gapEnd : o.len - 16;
  for (let x = o.gs; x <= lastGap; x += o.step + Math.floor(r() * 3)) g.push([x, 2 + Math.floor(r() * 2)]);
  const segs = []; let c = 0;
  g.forEach(([gx, gw]) => { segs.push([c, gx]); c = gx + gw; }); segs.push([c, o.len]);
  segs.forEach(([a, b], si) => {
    const last = si == segs.length - 1, end = o.boss && last ? o.a0 - 2 : b - (last ? 6 : 0), off = si == 0 ? 8 : 2, n = end - a;
    if (n >= off + 11) p.push([a + off, 9, 3], [a + off + 4, 7, 3], [a + off + 8, 5, 3]);
    else if (n >= off + 7) p.push([a + off, 9, 3], [a + off + 4, 7, 3]);
    else if (n >= off + 4) p.push([a + off, 9, 3]);
    const e1 = Math.max(a + 3, 10), e2 = a + Math.floor(n * .65);
    if (e1 < end - 2) e.push(e1);
    if (e2 > e1 + 3 && e2 < end - 2) e.push(e2);
  });
  e.sort((a, b) => a - b);
  const d = { n: o.n, len: o.len, sp: o.sp, g, p, e, lab: o.lab };
  if (o.boss) Object.assign(d, { boss: o.boss, bx: o.bx, a0: o.a0, a1: o.a1 });
  return d;
}
L.push(
  xpGen({ n: 'Pulau Aljabar', len: 100, sp: 85, seed: 11, gs: 16, step: 13, lab: ['x', 'y', '2x+3', 'a+b', 'x=?'] }),
  xpGen({ n: 'Gurun Statistik', len: 105, sp: 90, seed: 12, gs: 16, step: 12, lab: ['μ', 'σ', 'Σx', 'n', '50%', 'Q1'] }),
  xpGen({ n: 'Kota Geometri', len: 110, sp: 95, seed: 13, gs: 16, step: 12, lab: ['△', '□', '○', '90°', '∠', 'πr²'] }),
  xpGen({ n: 'Galaksi Integral', len: 110, sp: 100, seed: 14, gs: 16, step: 11, lab: ['∫', 'dx', 'lim', '∞', 'dy', 'eˣ'] }),
  xpGen({ n: 'Menara Ujian Akhir', len: 100, sp: 105, seed: 15, gs: 16, step: 12, lab: ['π', '∫∫', 'Σ', '∞', 'UN'], boss: 2, gapEnd: 54, bx: 78, a0: 62, a1: 90 })
);
th.push(
  ['#3ec6e0', '#e0f7ff', '#f2d27a', '#c9a15a', '#e0b96f', '#ffffff'],
  ['#ffb347', '#ffe9a8', '#e8c36a', '#b5833a', '#d9a050', '#c98a3a'],
  ['#0f1b3d', '#3a4a8a', '#5de0e6', '#27315e', '#3b4a86', '#8fa4ff'],
  ['#05010f', '#1a0b3d', '#b388ff', '#2a1b5e', '#4b34a0', '#ffffff'],
  ['#1a0000', '#6b0f1a', '#ffd93b', '#3a0d12', '#7a1a22', '#ff9a3d']
);

// ---------- 2. MUSIK LEVEL 11-15 ----------
const xpUp = n => n.replace(/\d$/, d => +d + 1);
function xpTrack(name, bpm, ch, ld, dr) {
  const arp = [], bass = [];
  ch.forEach(c => {
    for (let k = 0; k < 4; k++) [0, 1, 2, 1].forEach(i => arp.push([c[i], 1]));
    for (let k = 0; k < 4; k++) bass.push([c[3], 2], [xpUp(c[3]), 2]);
  });
  return { name, bpm, lead: [].concat(...ld), arp, bass, drum: dr };
}
const xpD1 = [['K', 2], ['H', 2], ['S', 2], ['H', 2], ['K', 2], ['H', 2], ['S', 2], ['H', 2]];
const xpD2 = [['K', 2], ['H', 1], ['H', 1], ['S', 2], ['H', 2], ['K', 1], ['K', 1], ['H', 2], ['S', 2], ['H', 2]];
const xpD3 = [['K', 4], ['H', 2], ['S', 2], ['K', 4], ['H', 2], ['S', 2]];
const xpD4 = [['K', 1], ['H', 1], ['K', 1], ['H', 1], ['S', 1], ['H', 1], ['K', 1], ['K', 1], ['K', 1], ['H', 1], ['K', 1], ['H', 1], ['S', 1], ['H', 1], ['S', 1], ['S', 1]];
BGM.lv10 = xpTrack('Island Breeze Algebra', 138,
  [['C4', 'E4', 'G4', 'C2'], ['A3', 'C4', 'E4', 'A2'], ['F3', 'A3', 'C4', 'F2'], ['G3', 'B3', 'D4', 'G2']],
  [[['E5', 2], ['G5', 2], ['C6', 4], ['B5', 2], ['G5', 2], ['A5', 4]], [['A5', 2], ['C6', 2], ['E6', 4], ['D6', 2], ['C6', 2], ['A5', 4]],
   [['F5', 2], ['A5', 2], ['C6', 4], ['A5', 2], ['F5', 2], ['G5', 4]], [['G5', 2], ['B5', 2], ['D6', 4], ['C6', 2], ['B5', 2], ['G5', 2], ['R', 2]]], xpD1);
BGM.lv11 = xpTrack('Sandstorm Statistik', 128,
  [['A3', 'C4', 'E4', 'A2'], ['G3', 'B3', 'D4', 'G2'], ['F3', 'A3', 'C4', 'F2'], ['E3', 'G#3', 'B3', 'E2']],
  [[['A4', 2], ['C5', 2], ['E5', 2], ['A5', 2], ['G#5', 2], ['E5', 2], ['C5', 2], ['E5', 2]], [['G4', 2], ['B4', 2], ['D5', 2], ['G5', 2], ['F5', 2], ['D5', 2], ['B4', 2], ['D5', 2]],
   [['F4', 2], ['A4', 2], ['C5', 2], ['F5', 2], ['E5', 2], ['C5', 2], ['A4', 2], ['C5', 2]], [['E5', 4], ['G#5', 2], ['B5', 4], ['G#5', 2], ['E5', 2], ['R', 2]]], xpD2);
BGM.lv12 = xpTrack('Neon Geometry City', 150,
  [['D4', 'F4', 'A4', 'D2'], ['Bb3', 'D4', 'F4', 'Bb1'], ['C4', 'E4', 'G4', 'C2'], ['A3', 'C#4', 'E4', 'A1']],
  [[['D5', 2], ['F5', 2], ['A5', 2], ['F5', 2], ['D5', 2], ['F5', 4], ['A5', 2]], [['Bb4', 2], ['D5', 2], ['F5', 2], ['D5', 2], ['Bb4', 2], ['D5', 4], ['F5', 2]],
   [['C5', 2], ['E5', 2], ['G5', 2], ['E5', 2], ['C5', 2], ['E5', 4], ['G5', 2]], [['A4', 2], ['C#5', 2], ['E5', 2], ['A5', 4], ['G5', 2], ['E5', 2], ['C#5', 2]]], xpD1);
BGM.lv13 = xpTrack('Integral Galaxy Drift', 120,
  [['E4', 'G4', 'B4', 'E2'], ['C4', 'E4', 'G4', 'C2'], ['G3', 'B3', 'D4', 'G2'], ['D4', 'F#4', 'A4', 'D2']],
  [[['B5', 4], ['G5', 2], ['E5', 2], ['G5', 4], ['B5', 2], ['E6', 2]], [['G5', 4], ['E5', 2], ['C5', 2], ['E5', 4], ['G5', 2], ['C6', 2]],
   [['D5', 4], ['B4', 2], ['G4', 2], ['B4', 4], ['D5', 2], ['G5', 2]], [['F#5', 4], ['A5', 2], ['D6', 2], ['A5', 4], ['F#5', 2], ['R', 2]]], xpD3);
BGM.lv14 = xpTrack('Final Exam Tower', 172,
  [['C4', 'Eb4', 'G4', 'C2'], ['Ab3', 'C4', 'Eb4', 'Ab1'], ['Bb3', 'D4', 'F4', 'Bb1'], ['G3', 'B3', 'D4', 'G1']],
  [[['C5', 1], ['C5', 1], ['Eb5', 2], ['G5', 2], ['C6', 2], ['Bb5', 2], ['G5', 2], ['Eb5', 2], ['G5', 2]],
   [['Ab4', 1], ['Ab4', 1], ['C5', 2], ['Eb5', 2], ['Ab5', 2], ['G5', 2], ['Eb5', 2], ['C5', 2], ['Eb5', 2]],
   [['Bb4', 1], ['Bb4', 1], ['D5', 2], ['F5', 2], ['Bb5', 2], ['A5', 2], ['F5', 2], ['D5', 2], ['F5', 2]],
   [['G4', 2], ['B4', 2], ['D5', 2], ['G5', 2], ['F5', 2], ['D5', 2], ['B4', 2], ['D5', 2]]], xpD4);

// ---------- 3. CUTSCENE LEVEL 11-15 ----------
const xpScenes = {};
function xpSky(c1, c2, gr, gt) {
  const g = X.createLinearGradient(0, 0, 0, 332); g.addColorStop(0, c1); g.addColorStop(1, c2);
  X.fillStyle = g; X.fillRect(0, 0, W, 332); rc(gr, 0, 262, W, 70); rc(gt, 0, 262, W, 8);
}
function xpHero(ts, p) {
  const walk = p == 2, x = walk ? Math.round(150 + 280 * es(Math.min(1, ts / 2))) : 300;
  hero(x, 262, 4, walk && ts < 2 ? Math.sin(at * 14) : 0, 1, p == 1 ? -.1 : 0);
  if (p == 1) { tx('!!', x, 104, 42, '#ffd93b'); rc('#4fc3f7', x + 26, 140 + ((at * 30) % 22), 3, 6); }
  if (p == 0 && ((at * 1.4) | 0) % 2) bub(x + 28, 118, '...');
}
xpScenes.pulau = (ts, p) => {
  xpSky('#3ec6e0', '#e0f7ff', '#f2d27a', '#e0b96f');
  X.fillStyle = '#ffe066'; X.beginPath(); X.arc(660, 70, 32, 0, 7); X.fill();
  rc('#2a9ed8', 0, 200, W, 62);
  for (let i = 0; i < 10; i++) rc('rgba(255,255,255,.6)', (i * 97 + at * 20) % W, 208 + (i % 3) * 16, 30, 3);
  for (const x of [90, 640]) { rc('#7c4d2b', x, 150, 10, 112); rc('#2e9e4a', x - 22, 142, 28, 7); rc('#2e9e4a', x + 6, 142, 28, 7); rc('#2e9e4a', x - 10, 132, 30, 7); }
  xpHero(ts, p);
};
xpScenes.gurun = (ts, p) => {
  xpSky('#ffb347', '#ffe9a8', '#e8c36a', '#d9a050');
  X.fillStyle = '#ff7a1a'; X.beginPath(); X.arc(640, 80, 46, 0, 7); X.fill();
  X.fillStyle = '#d9a050'; X.beginPath(); X.moveTo(380, 262); X.lineTo(520, 120); X.lineTo(660, 262); X.fill();
  X.fillStyle = '#b5833a'; X.beginPath(); X.moveTo(520, 120); X.lineTo(660, 262); X.lineTo(540, 262); X.fill();
  rc('#2e7d32', 90, 190, 14, 72); rc('#2e7d32', 72, 210, 20, 8); rc('#2e7d32', 72, 196, 8, 22); rc('#2e7d32', 104, 220, 18, 8);
  X.fillStyle = '#8b5a2b'; X.beginPath(); X.arc(((at * 60) % 900) - 40, 250, 10, 0, 7); X.fill();
  xpHero(ts, p);
};
xpScenes.kota = (ts, p) => {
  xpSky('#0f1b3d', '#3a4a8a', '#27315e', '#5de0e6');
  for (let i = 0; i < 12; i++) rc(`rgba(255,255,255,${.4 + .5 * Math.sin(at * 2 + i) ** 2})`, (i * 71) % W, (i * 37) % 120, 2, 2);
  for (let i = 0; i < 9; i++) {
    const h = 90 + (i * 53) % 110, x = i * 92 - 10; rc('#1a2350', x, 262 - h, 70, h);
    for (let j = 0; j < h - 20; j += 22) for (let k = 0; k < 3; k++) if ((i + j + k) % 3) rc('#ffe066', x + 8 + k * 20, 270 - h + j, 10, 12);
  }
  X.fillStyle = '#5de0e6'; X.fillRect(0, 258, W, 4);
  xpHero(ts, p);
};
xpScenes.galaksi = (ts, p) => {
  xpSky('#05010f', '#1a0b3d', '#2a1b5e', '#b388ff');
  for (let i = 0; i < 40; i++) rc(`rgba(255,255,255,${.3 + .6 * Math.sin(at * 2 + i) ** 2})`, (i * 83) % W, (i * 47) % 250, 2, 2);
  X.fillStyle = '#7e57c2'; X.beginPath(); X.arc(600, 110, 54, 0, 7); X.fill();
  X.strokeStyle = '#d1b3ff'; X.lineWidth = 6; X.beginPath(); X.ellipse(600, 110, 92, 20, -.3, 0, 7); X.stroke();
  X.fillStyle = '#26c6da'; X.beginPath(); X.arc(150, 80, 22, 0, 7); X.fill();
  xpHero(ts, p);
};
xpScenes.menara = (ts, p) => {
  xpSky('#1a0000', '#6b0f1a', '#3a0d12', '#ffd93b');
  rc('#2b0508', 520, 20, 120, 242); for (let i = 0; i < 4; i++) rc('#2b0508', 520 + i * 36, 6, 18, 14);
  rc('#ff5252', 570, 90, 20, 30); rc('#ff5252', 570, 150, 20, 30);
  if (((at * 2) | 0) % 5 == 0) { rc('rgba(255,255,255,.25)', 0, 0, W, 332); X.strokeStyle = '#fff'; X.lineWidth = 3; X.beginPath(); X.moveTo(300, 0); X.lineTo(284, 80); X.lineTo(306, 80); X.lineTo(288, 170); X.stroke(); }
  for (let i = 0; i < 8; i++) rc('#ff9a3d', (i * 101 + at * 20) % W, 262 - ((i * 37 + at * 40) % 240), 3, 3);
  xpHero(ts, p);
};
CS[11] = { pre: [{ b: 'pulau', p: 1, t: 'LOH?! KOK ADA PANTAI?? BUKANNYA UDAH TAMAT?!', d: .5, m: 1.6 }, { b: 'pulau', p: 0, t: 'jangan bilang masih ada pelajaran lagi..', d: .3 }], post: [{ b: 'pulau', p: 2, t: 'oke pulaunya aman, lanjut cari jalan pulang', d: .4 }] };
CS[12] = { pre: [{ b: 'gurun', p: 1, t: 'PANAS BANGET NJIR! INI GURUN APAAN??', d: .5, m: 1.6 }, { b: 'gurun', p: 0, t: 'statistik? gw bahkan gak ngerti rata-rata nilai gw', d: .3 }], post: [{ b: 'gurun', p: 2, t: 'fiuh.. akhirnya keluar dari gurun', d: .4 }] };
CS[13] = { pre: [{ b: 'kota', p: 0, t: 'kota apaan ini, bangunannya kotak semua', d: .4 }, { b: 'kota', p: 1, t: 'ITU SEGITIGA JALAN SENDIRI!!', d: .5, m: 1.6 }], post: [{ b: 'kota', p: 2, t: 'geometri kok serem amat dah', d: .4 }] };
CS[14] = { pre: [{ b: 'galaksi', p: 1, t: 'GW DI LUAR ANGKASA?!', d: .5, m: 1.6 }, { b: 'galaksi', p: 0, t: 'integral.. luas dibawah kurva.. ahh pusing', d: .3 }], post: [{ b: 'galaksi', p: 2, t: 'itu menaranya.. ujian terakhir..', d: .4 }] };
CS[15] = { pre: [{ b: 'menara', p: 1, t: 'ITU BOS PI?! KOK BALIK LAGI?!', d: .5, m: 1.7 }, { b: 'menara', p: 0, t: 'yaudah deh, sekali lagi aja', d: .3 }], post: [{ b: 'menara', p: 2, t: 'AKHIRNYA BENERAN TAMAT! GW MAU PULANG!!', d: .5, m: 1.8 }] };

const xpDrawCut0 = drawCut;
drawCut = function () {
  const s = cs.sc[cs.i], f = xpScenes[s.b];
  if (!f) return xpDrawCut0();
  const ts = at - cs.t0;
  X.save(); X.beginPath(); X.rect(0, 0, W, 332); X.clip();
  f(ts, s.p);
  rc(`rgba(0,0,0,${Math.max(0, 1 - ts * 3.5)})`, 0, 0, W, 332);
  X.restore(); sub(s, ts);
  rc('#000', W - 110, 6, 102, 28); rc('#444', W - 108, 8, 98, 24); tx('SKIP ▶▶', W - 59, 27, 13, '#fff'); tx(`${cs.i + 1}/${cs.sc.length}`, 40, 27, 14, '#fff');
};

// ---------- 4. LATAR & HIASAN LEVEL 11-15 ----------
const xpBgx0 = bgx;
bgx = function (i, px, k) {
  if (lv < 10) return xpBgx0(i, px, k);
  const m = i % 4;
  if (lv == 10) {
    if (m == 0) { X.fillStyle = '#7c4d2b'; X.fillRect(px + 30, 300, 8, 84); X.fillStyle = '#2e9e4a'; X.fillRect(px + 8, 292, 28, 7); X.fillRect(px + 34, 292, 28, 7); X.fillRect(px + 20, 282, 30, 7); }
    else if (m == 1) { X.fillStyle = '#8b5a2b'; X.fillRect(px, 350, 56, 10); X.fillStyle = '#fff'; X.beginPath(); X.moveTo(px + 26, 300); X.lineTo(px + 26, 348); X.lineTo(px + 50, 348); X.fill(); }
    else if (m == 2) { X.fillStyle = 'rgba(255,255,255,.9)'; X.fillRect(px, 80 + k * 40, 70, 14); X.fillRect(px + 12, 70 + k * 40, 40, 12); }
    else { X.fillStyle = 'rgba(42,158,216,.6)'; X.fillRect(px, 372, 130, 12); }
  } else if (lv == 11) {
    if (m == 0) { X.fillStyle = '#d9a050'; X.beginPath(); X.moveTo(px - 40, 384); X.lineTo(px + 50, 250 + k * 20); X.lineTo(px + 140, 384); X.fill(); }
    else if (m == 1) { X.fillStyle = '#2e7d32'; X.fillRect(px + 20, 316, 12, 68); X.fillRect(px + 8, 336, 12, 8); X.fillRect(px + 8, 326, 6, 18); X.fillRect(px + 32, 346, 14, 8); }
    else if (m == 2) { X.fillStyle = '#e8c36a'; X.beginPath(); X.arc(px + 40, 384, 60, Math.PI, 0); X.fill(); }
    else { X.fillStyle = 'rgba(255,255,255,.5)'; X.fillRect(px, 100 + k * 30, 60, 10); }
  } else if (lv == 12) {
    const h = 120 + (i * 37) % 110, w = 44 + k * 14;
    X.fillStyle = '#1a2350'; X.fillRect(px, 384 - h, w, h);
    for (let j = 0; j < h - 24; j += 22) for (let c = 0; c < 3; c++) if ((i + j + c) % 3) { X.fillStyle = '#ffe066'; X.fillRect(px + 6 + c * 14, 394 - h + j, 8, 11); }
    X.fillStyle = '#5de0e6'; X.fillRect(px, 384 - h, w, 3);
  } else if (lv == 13) {
    if (m < 3) { const cy = 80 + k * 70, r = 18 + m * 8; X.fillStyle = ['#7e57c2', '#26c6da', '#ef5350'][m]; X.beginPath(); X.arc(px + 40, cy, r, 0, 7); X.fill(); X.strokeStyle = 'rgba(209,179,255,.8)'; X.lineWidth = 3; X.beginPath(); X.ellipse(px + 40, cy, r + 18, 6, -.3, 0, 7); X.stroke(); }
  } else {
    X.fillStyle = '#3a0d12'; X.beginPath(); X.moveTo(px, 384); X.lineTo(px + 20, 150 + k * 30); X.lineTo(px + 40, 384); X.fill();
    X.fillStyle = `rgba(255,82,82,${.6 + .3 * Math.sin(at * 3 + i)})`; X.fillRect(px + 16, 146 + k * 30, 8, 8);
  }
};
const xpDeco20 = deco2;
deco2 = function (k) {
  if (k < 10) return xpDeco20(k);
  const R = W + 240;
  if (k == 10) {
    X.fillStyle = '#ffe066'; X.beginPath(); X.arc(690, 70, 30, 0, 7); X.fill();
    for (let i = 0; i < 3; i++) bird(wr(30 + i * 8, i * 300, .3, R), 60 + i * 40 + Math.sin(at + i) * 8, 1.1, '#2b3a55');
    for (let i = 0; i < 12; i++) { X.fillStyle = 'rgba(255,255,255,.6)'; X.fillRect(ww(i * 83 + at * 24 - cam * .5, W), 392 - (i % 3) * 0, 24, 3); }
  } else if (k == 11) {
    X.fillStyle = '#ff7a1a'; X.beginPath(); X.arc(680, 80, 44, 0, 7); X.fill();
    for (let i = 0; i < 16; i++) { X.fillStyle = 'rgba(255,230,160,.6)'; X.fillRect(ww(i * 97 + at * 90 - cam * .4, W), (i * 41) % 380, 14, 2); }
  } else if (k == 12) {
    for (let i = 0; i < 30; i++) { X.fillStyle = `rgba(255,255,255,${.3 + .5 * Math.sin(at * 2 + i) ** 2})`; X.fillRect(ww(i * 71 - cam * .08, W), (i * 37) % 150, 2, 2); }
    const bx = ww(at * 40, W + 200) - 100; X.fillStyle = 'rgba(93,224,230,.12)'; X.beginPath(); X.moveTo(bx, 384); X.lineTo(bx - 40, 0); X.lineTo(bx + 40, 0); X.fill();
  } else if (k == 13) {
    for (let i = 0; i < 40; i++) { X.fillStyle = `rgba(255,255,255,${.3 + .6 * Math.sin(at * 2 + i) ** 2})`; X.fillRect(ww(i * 83 - cam * .1, W), (i * 53) % 330, 2, 2); }
    const sx = ww(at * 160, W + 300) - 100; X.strokeStyle = '#fff'; X.lineWidth = 2; X.beginPath(); X.moveTo(sx, 60 + (sx % 40)); X.lineTo(sx - 40, 40 + (sx % 40)); X.stroke();
  } else {
    for (let i = 0; i < 20; i++) { X.fillStyle = `rgba(255,${120 + (i * 7) % 90},50,.8)`; X.fillRect(ww(i * 61 + Math.sin(at + i) * 14 - cam * .4, W), H - ww(i * 47 + at * (30 + i % 4 * 12), H), 3, 3); }
    const ph = at % 6; if (ph < .15) { X.fillStyle = 'rgba(255,255,255,.2)'; X.fillRect(0, 0, W, H); }
    const g = X.createRadialGradient(W / 2, H / 2, 180, W / 2, H / 2, 480); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,0,0,.45)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  }
};

// ---------- 5. LAYAR SELESAI LEVEL (menyesuaikan jumlah level) ----------
complete = function () {
  st = 'done'; bgmSync(); jingle('win'); const b = lives * 200; addScore(b);
  if (!S.done.includes(lv + 1)) S.done.push(lv + 1);
  S.last = Math.min(L.length, lv + 2); save();
  const sc = `Bonus nyawa: +${b} • Skor: ${S.score}`;
  const row = `<div class=row><button class=g data-a=next>Level Berikutnya</button><button data-a=levels>Peta</button><button data-a=menu>Menu</button></div>`;
  let html;
  if (lv == L.length - 1) html = `<h1>TAMAT!</h1><p>Kamu mengalahkan BOS π yang kembali! Seluruh dunia Mat sudah aman, kali ini beneran!</p><p>Skor: ${S.score} • Best: ${S.best}</p><button data-a=menu>Menu Utama</button>`;
  else if (lv == 9) html = `<h2>BOS π KALAH!</h2><p>Tapi dunia Mat belum berakhir... 5 dunia baru terbuka!<br>${sc}</p>` + row;
  else html = `<h2>LEVEL SELESAI!</h2><p>${L[lv].n}<br>${lv == 4 ? 'THE GREAT EQUATION kalah! Taman Sekolah terbuka!<br>' : ''}${sc}</p>` + row;
  const fin = () => { st = 'done'; bgmSync(); ui(html); }, c = CS[lv + 1];
  if (c && c.post) cut(c.post, fin); else fin();
};

// ---------- 6. BERANDA: lanjut ke level terakhir (sampai level 15) ----------
A.play = function () { const i = Math.max(0, Math.min(L.length - 1, S.last - 1)); trans(() => start(i)); };
const xpMenu0 = menu;
menu = function () {
  xpMenu0();
  lv = Math.max(0, Math.min(L.length - 1, S.last - 1));
  const e = document.querySelector('.lvn'); if (e) e.innerHTML = `<small>LEVEL ${lv + 1}</small><br>${L[lv].n}`;
};
A.menu = menu;

// ---------- 7. PETA HALAMAN 3 ----------
const xpPg = q => Math.floor(q / 5), xpGo = q => { if (xpPg(q) != xpPg(mi)) mp = q; mi = q; };
const XP_RC = ['#7be0ff', '#ffd27a', '#8fa4ff', '#c39bff', '#ff6b6b'];
openMap = function () { mi = Math.min(L.length - 1, Math.max(0, S.last - 1)); if (!unl(mi)) mi = 0; mp = mi; st = 'map'; ui(''); bgmSync(); };

function xpScn(i, x, y) {
  if (i == 0) { rc('#7c4d2b', x - 3, y - 14, 7, 36); X.fillStyle = '#2e9e4a'; X.fillRect(x - 22, y - 20, 24, 7); X.fillRect(x + 2, y - 20, 24, 7); X.fillRect(x - 10, y - 30, 24, 7); tx('x=?', x, y - 40, 16, '#fff'); }
  else if (i == 1) { X.fillStyle = '#d9a050'; X.beginPath(); X.moveTo(x - 34, y + 22); X.lineTo(x, y - 22); X.lineTo(x + 34, y + 22); X.fill(); tx('σ', x, y - 30, 18, '#fff'); }
  else if (i == 2) { for (let k = -1; k < 2; k++) { rc('#1a2350', x + k * 22 - 9, y - 8 - (k == 0) * 12, 18, 30 + (k == 0) * 12); rc('#ffe066', x + k * 22 - 3, y - 2 - (k == 0) * 12, 6, 6); } tx('△', x, y - 30, 18, '#5de0e6'); }
  else if (i == 3) { X.fillStyle = '#7e57c2'; X.beginPath(); X.arc(x, y + 6, 20, 0, 7); X.fill(); X.strokeStyle = '#d1b3ff'; X.lineWidth = 4; X.beginPath(); X.ellipse(x, y + 6, 36, 8, -.3, 0, 7); X.stroke(); tx('∫', x, y - 22, 20, '#ffd93b'); }
  else { rc('#2b0508', x - 18, y - 20, 36, 44); for (let k = 0; k < 3; k++) rc('#2b0508', x - 18 + k * 14, y - 28, 8, 8); rc('#ff5252', x - 4, y - 8, 8, 10); rc('#d62839', x, y - 46, 2, 18); rc('#d62839', x + 2, y - 46, 12 + Math.sin(at * 6) * 3, 7); }
}
function xpMap3() {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1250'); g.addColorStop(.55, '#6a3fae'); g.addColorStop(1, '#f08a5d'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) { X.fillStyle = `rgba(255,255,255,${.3 + .5 * Math.sin(at * 2 + i) ** 2})`; X.fillRect((i * 97) % W, (i * 53) % 260, 2, 2); }
  X.fillStyle = '#ffe9c4'; X.beginPath(); X.arc(110, 92, 30, 0, 7); X.fill(); X.fillStyle = '#6a3fae'; X.beginPath(); X.arc(122, 86, 27, 0, 7); X.fill();
  MN.forEach((n, i) => {
    const r = X.createRadialGradient(n[0], n[1], 10, n[0], n[1], 110); r.addColorStop(0, XP_RC[i]); r.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = r; X.fillRect(n[0] - 110, n[1] - 110, 220, 220);
    X.fillStyle = 'rgba(20,10,50,.55)'; X.beginPath(); X.ellipse(n[0], n[1] + 16, 58, 16, 0, 0, 7); X.fill();
  });
  X.lineCap = X.lineJoin = 'round'; X.beginPath(); X.moveTo(MN[0][0], MN[0][1]);
  for (let i = 1; i < 5; i++) { const a = MN[i - 1], b = MN[i]; X.bezierCurveTo(a[0] + 60, a[1], b[0] - 60, b[1], b[0], b[1]); }
  X.strokeStyle = '#3a2a5a'; X.lineWidth = 24; X.stroke(); X.strokeStyle = '#c9b3ff'; X.lineWidth = 18; X.stroke(); X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 3; X.setLineDash([3, 12]); X.stroke(); X.setLineDash([]);
  MN.forEach((n, i) => xpScn(i, n[0], n[1] - 56));
  MN.forEach((n, j) => {
    const i = 10 + j, ok = unl(i), dn = S.done.includes(i + 1);
    if (i == mi) { X.strokeStyle = '#fff'; X.lineWidth = 3; X.beginPath(); X.arc(n[0], n[1], 25 + Math.sin(at * 5) * 3, 0, 7); X.stroke(); }
    X.fillStyle = '#000'; X.beginPath(); X.arc(n[0], n[1], 21, 0, 7); X.fill(); X.fillStyle = dn ? '#2a9d4a' : ok ? '#ffd93b' : '#777'; X.beginPath(); X.arc(n[0], n[1], 17, 0, 7); X.fill();
    tx(ok ? (dn ? '✓' : '' + (i + 1)) : '🔒', n[0], n[1] + 6, ok ? 18 : 14, '#fff');
  });
  const m0 = mp - 10, f = Math.max(0, Math.min(3, m0 | 0)), q = bz(MN[f], MN[f + 1], Math.max(0, Math.min(1, m0 - f))), ay = q[1] - 36 - Math.abs(Math.sin(at * 7)) * (Math.abs(mp - mi) > .05 ? 9 : 2), ax = q[0];
  X.fillStyle = '#000'; X.fillRect(ax - 10, ay - 2, 20, 30); X.fillStyle = '#ff7aa2'; X.fillRect(ax - 8, ay, 16, 5); X.fillStyle = '#ffd93b'; X.fillRect(ax - 8, ay + 5, 16, 13); X.fillStyle = '#f2c28b'; X.beginPath(); X.moveTo(ax - 8, ay + 18); X.lineTo(ax + 8, ay + 18); X.lineTo(ax, ay + 27); X.fill(); X.fillStyle = '#000'; X.fillRect(ax - 4, ay + 9, 3, 4); X.fillRect(ax + 2, ay + 9, 3, 4);
  tx('DUNIA BARU MAT', W / 2, 36, 26, '#ffd93b');
  tx(`Level ${mi + 1}: ${L[mi].n}  (♪ ${BGM['lv' + mi].name})`, W / 2, H - 66, 16, '#fff');
  btn(10, 10, 92, 30, '#e63946', '◀ Menu'); btn(W / 2 - 75, H - 52, 150, 38, '#2a9d4a', 'MAIN ▶'); btn(10, H - 52, 126, 38, '#8e44ad', '◀ Hal 2');
}
const xpDrawMap0 = drawMap;
drawMap = function () {
  if (mi >= 10) { xpMap3(); return; }
  xpDrawMap0();
  if (mi >= 5) btn(W - 136, H - 52, 126, 38, unl(10) ? '#8e44ad' : '#777', 'Hal 3 ▶');
};

mapKey = function (e) {
  if (tr) return;
  const c = e.code, go = d => { const q = mi + d; if (q >= 0 && q < L.length && unl(q)) { xpGo(q); sfx(600, .06); } };
  if (c == 'ArrowLeft' || c == 'KeyA') go(-1); else if (c == 'ArrowRight' || c == 'KeyD') go(1);
  else if (c == 'Enter' || c == 'Space') { const m = mi; trans(() => start(m)); } else if (c == 'Escape') menu(); else return;
  e.preventDefault();
};
// klik/sentuh di peta (menggantikan penanganan lama supaya mendukung 3 halaman)
document.getElementById('w').addEventListener('pointerdown', e => {
  if (st != 'map') return;
  e.stopPropagation();
  const r = C.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
  if (x < 106 && y < 46) { menu(); return; }
  const pg = xpPg(mi), B = pg * 5, deny = () => sfx(150, .15, 'sawtooth');
  if (y > H - 56 && y < H - 8) {
    if (pg == 0 && x > W - 146) { if (unl(5)) { xpGo(5); sfx(600, .06); } else deny(); return; }
    if (pg == 1 && x > W - 146) { if (unl(10)) { xpGo(10); sfx(600, .06); } else deny(); return; }
    if (pg == 1 && x < 136) { xpGo(4); sfx(600, .06); return; }
    if (pg == 2 && x < 136) { xpGo(9); sfx(600, .06); return; }
  }
  for (let j = 0; j < 5; j++) {
    const i = B + j;
    if (Math.hypot(x - MN[j][0], y - MN[j][1]) < 30) {
      if (!unl(i)) deny(); else if (i == mi && Math.abs(mp - mi) < .1) trans(() => start(i)); else { mi = i; sfx(600, .06); }
      return;
    }
  }
  if (Math.abs(x - W / 2) < 76 && y > H - 56 && y < H - 8) { const m = mi; trans(() => start(m)); }
}, true);

menu();   // gambar ulang beranda
