'use strict';

// ===== RODA SPIN KOIN + TIKET (versi RETRO 8-bit) =====
// Dimuat SETELAH game.js (memakai S, A, ui, save, sfx dari game.js)
const SP = {
  prizes: [10, 50, 100, 200, 300, 1000],
  weights: [35, 25, 20, 12, 6, 2],   // peluang (%) tiap hadiah
  cols: ['#ef7d57', '#3b5dc9', '#38b764', '#a24bb0', '#b13e53', '#ffcd75'], // palet 16-warna
  freePerDay: 5,                     // spin gratis per hari
  tixCost: 10,                       // tiket yang dibutuhkan untuk 1 spin ekstra
  rot: 0,
  busy: false
};

(() => {
  if (document.getElementById('spcss')) return;
  const st = document.createElement('style');
  st.id = 'spcss';
  st.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* panel #ui transparan, kotak retro dibuat oleh #spw sendiri */
#ui:has(#spw){background:none!important;border:none!important;box-shadow:none!important;backdrop-filter:none!important;outline:none!important}

#spw{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:1.17cqw;
  padding:1.8cqw 3.6cqw 2.16cqw;
  font-family:'Press Start 2P',ui-monospace,Menlo,Consolas,monospace;image-rendering:pixelated;
  background:
    repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 .36cqw,transparent .36cqw .72cqw),
    radial-gradient(ellipse at 50% 45%,#29366f 0%,#1a1c2c 78%);
  /* bingkai piksel berlapis: hitam - emas - hitam */
  box-shadow:0 0 0 .54cqw #000,0 0 0 1.08cqw #ffcd75,0 0 0 1.62cqw #000,0 1.08cqw 0 1.62cqw #000}
#spw>*:not(#spfx){position:relative;z-index:1}
/* garis scanline layar CRT */
#spw::after{content:'';position:absolute;inset:0;z-index:5;pointer-events:none;
  background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 .135cqw,transparent .135cqw .405cqw)}

/* judul */
#spw h2{margin:0;font:inherit;font-size:2.16cqw;line-height:1.4;color:#ffcd75;letter-spacing:.09cqw;
  text-shadow:.27cqw .27cqw 0 #b13e53,.54cqw .54cqw 0 #000}
#spw h2.pop{animation:sppop .4s steps(4)}

/* roda */
#swrap{position:relative;width:26.1cqw;height:26.1cqw}
#swrap.win{animation:spflash .8s steps(6)}
#sw{width:100%;height:100%;display:block;background:transparent!important;background-color:transparent!important;
  border:none!important;box-shadow:none!important;outline:none!important;
  image-rendering:pixelated;image-rendering:crisp-edges;image-rendering:pixelated}

/* teks hasil & info */
#sr{margin:0;min-height:2.34cqw;font-size:1.53cqw;line-height:1.5;text-align:center;color:#a7f070;
  text-transform:uppercase;text-shadow:.225cqw .225cqw 0 #000}
#sr.pop{animation:sppop .5s steps(5);color:#ffcd75}
#si{margin:0;max-width:55.8cqw;text-align:center;font-size:.855cqw;line-height:1.8;color:#73eff7;
  text-transform:uppercase;padding:.72cqw 1.44cqw;background:#333c57;
  box-shadow:0 -.27cqw 0 0 #000,0 .27cqw 0 0 #000,-.27cqw 0 0 0 #000,.27cqw 0 0 0 #000,
    inset -.27cqw -.27cqw 0 0 #1a1c2c,inset .27cqw .27cqw 0 0 #566c86}

/* tombol kotak retro */
#spw .row{display:flex;gap:2.16cqw;justify-content:center;margin-top:.72cqw}
#spw button{font:inherit;font-size:1.53cqw;color:#fff;text-transform:uppercase;
  padding:1.17cqw 2.52cqw;border:.36cqw solid #000;border-radius:0;cursor:pointer;
  box-shadow:.54cqw .54cqw 0 0 #000;transition:none}
#spw button#sb{background:#38b764;font-size:1.8cqw;padding:1.26cqw 3.24cqw}
#spw button#sm{background:#3b5dc9}
#spw button:hover:not(:disabled){background-color:#ffcd75;color:#000}
#spw button:active:not(:disabled){transform:translate(.54cqw,.54cqw);box-shadow:none}
#spw button:disabled{background:#566c86;color:#94b0c2;cursor:not-allowed}

/* koin piksel melayang & kilau */
#spfx{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.fc{position:absolute;top:105%;aspect-ratio:1;animation:spfloat linear infinite;animation-timing-function:steps(36)}
.fc b{display:block;width:100%;height:100%;background:#ffcd75;
  clip-path:polygon(25% 0,75% 0,75% 12%,88% 12%,88% 25%,100% 25%,100% 75%,88% 75%,88% 88%,75% 88%,75% 100%,25% 100%,25% 88%,12% 88%,12% 75%,0 75%,0 25%,12% 25%,12% 12%,25% 12%);
  box-shadow:inset -.36cqw -.36cqw 0 0 #c98a00,inset .315cqw .315cqw 0 0 #fff4a8;
  animation:spflip 1.2s steps(1) infinite}
.ks{position:absolute;font-size:.9cqw;width:.3em;height:.3em;background:currentColor;opacity:0;
  box-shadow:0 -.3em 0 currentColor,0 .3em 0 currentColor,-.3em 0 0 currentColor,.3em 0 0 currentColor;
  animation:sptwinkle steps(1) infinite}
.bc{position:absolute;left:50%;top:50%;width:2.16cqw;height:2.16cqw;z-index:3;pointer-events:none;background:#ffcd75;
  clip-path:polygon(25% 0,75% 0,75% 12%,88% 12%,88% 25%,100% 25%,100% 75%,88% 75%,88% 88%,75% 88%,75% 100%,25% 100%,25% 88%,12% 88%,12% 75%,0 75%,0 25%,12% 25%,12% 12%,25% 12%);
  box-shadow:inset -.315cqw -.315cqw 0 0 #c98a00,inset .27cqw .27cqw 0 0 #fff4a8;
  animation:spburst 1.2s steps(10) forwards}
.bs{position:absolute;left:50%;top:50%;z-index:3;pointer-events:none;width:.9cqw;height:.9cqw;background:currentColor;
  animation:spburst 1.2s steps(10) forwards}

@keyframes spfloat{0%{top:105%;opacity:0}8%{opacity:1}88%{opacity:1}100%{top:-12%;opacity:0}}
@keyframes spflip{0%{transform:scaleX(1)}25%{transform:scaleX(.5)}50%{transform:scaleX(.2)}75%{transform:scaleX(.5)}}
@keyframes sptwinkle{0%{opacity:0}25%{opacity:1}60%{opacity:.5}80%{opacity:1}}
@keyframes spbeat{0%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes spflash{0%,40%,80%{filter:brightness(2.2)}20%,60%,100%{filter:brightness(1)}}
@keyframes sppop{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes spburst{
  0%{transform:translate(-50%,-50%) scale(.4);opacity:1}
  55%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1);opacity:1}
  100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy) + 10.8cqw)) scale(.8);opacity:0}}
@media (prefers-reduced-motion:reduce){.fc,.ks{animation:none}}
`;
  document.head.appendChild(st);
})();

const spToday = () => new Date().toDateString();
const spUsed = () => S.spinDay === spToday() ? (S.spinUsed | 0) : 0;
const spFree = () => Math.max(0, SP.freePerDay - spUsed());
const spCan = () => spFree() > 0 || (S.tix | 0) >= SP.tixCost;
const spInfo = () => `Spin gratis: ${spFree()}/${SP.freePerDay} • Tiket: 🎟 ${S.tix | 0} (${SP.tixCost} tiket = 1 spin ekstra)`;
const spLabel = () => spFree() > 0 ? 'PUTAR!' : `PUTAR (-${SP.tixCost} 🎟)`;

function spPick() {
  const tot = SP.weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < SP.weights.length; i++) { r -= SP.weights[i]; if (r < 0) return i; }
  return 0;
}

// koin piksel melayang + kilau di latar layar spin
function spFx() {
  let h = '';
  for (let i = 0; i < 10; i++) {
    const sz = (2.2 + Math.random() * 2) * .9, dur = 7 + Math.random() * 6;
    h += `<i class=fc style="left:${(4 + Math.random() * 90).toFixed(1)}%;width:${sz.toFixed(1)}cqw;` +
         `animation-duration:${dur.toFixed(1)}s;animation-delay:-${(Math.random() * dur).toFixed(1)}s"><b style="animation-delay:-${(Math.random() * 3).toFixed(1)}s"></b></i>`;
  }
  const cs = ['#f4f4f4', '#ffcd75', '#73eff7', '#ef7d57'];
  for (let i = 0; i < 16; i++) {
    h += `<i class=ks style="left:${(2 + Math.random() * 94).toFixed(1)}%;top:${(4 + Math.random() * 88).toFixed(1)}%;` +
         `font-size:${((1 + Math.random() * 1.2) * .9).toFixed(2)}cqw;color:${cs[i % cs.length]};` +
         `animation-duration:${(1.6 + Math.random() * 1.8).toFixed(1)}s;animation-delay:-${(Math.random() * 3).toFixed(1)}s"></i>`;
  }
  return h;
}

// ledakan koin saat menang
function spBurst(amt) {
  const w = document.getElementById('swrap'); if (!w) return;
  const n = amt >= 200 ? 26 : 14, cs = ['#f4f4f4', '#ffcd75', '#73eff7', '#ef7d57'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = (8 + Math.random() * 14) * .9;
    const el = document.createElement('i');
    el.className = i % 3 === 0 ? 'bs' : 'bc';
    if (i % 3 === 0) el.style.color = cs[i % cs.length];
    el.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'cqw');
    el.style.setProperty('--dy', (Math.sin(a) * d - 3.6).toFixed(1) + 'cqw');
    el.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
    w.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
  w.classList.remove('win'); void w.offsetWidth; w.classList.add('win');
  setTimeout(() => w.classList.remove('win'), 900);
}

function spPop(el) { if (!el) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

// ---------- gambar roda pixel-art (dirender per piksel, 160x160) ----------
const SPW = 160;
const SPDIG = {
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '001', '001', '001'],
  8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111']
};
const spHex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const spMix = (c, t, k) => [c[0] + (t[0] - c[0]) * k | 0, c[1] + (t[1] - c[1]) * k | 0, c[2] + (t[2] - c[2]) * k | 0];
const SPBLK = [0, 0, 0], SPWHT = [244, 244, 244], SPGOLD = [255, 205, 117], SPGOLD2 = [201, 138, 0], SPGOLD3 = [255, 244, 168];

// apakah piksel teks di koordinat lokal (u,v) menyala? (skala 2x, 3x5 font)
function spGlyph(s, u, v) {
  const tw = s.length * 4 - 1;
  const gx = Math.floor(u / 2 + tw / 2), gy = Math.floor((40 - v) / 2 + 2.5);
  if (gy < 0 || gy > 4 || gx < 0 || gx >= tw) return 0;
  const c = gx & 3; if (c === 3) return 0;
  return SPDIG[s[gx >> 2]][gy][c] === '1' ? 1 : 0;
}

function spDraw(cv, rot, tm, fast) {
  tm = tm || 0;
  const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
  if (!SP._rgb) SP._rgb = SP.cols.map(h => { const b = spHex(h); return [b, spMix(b, SPWHT, .35), spMix(b, SPBLK, .28)]; });
  if (!cv._id) cv._id = c.createImageData(SPW, SPW);
  const img = cv._id, d = img.data, n = SP.prizes.length, seg = 360 / n, rad = Math.PI / 180, cx = 80, cy = 80;
  const txt = SP.prizes.map(String);

  for (let y = 0; y < SPW; y++) {
    for (let x = 0; x < SPW; x++) {
      const dx = x + .5 - cx, dy = y + .5 - cy, r = Math.sqrt(dx * dx + dy * dy), o = (y * SPW + x) * 4;
      let col = null;
      if (r > 77) { d[o + 3] = 0; continue; }
      if (r > 73 || (r > 63 && r <= 65)) col = SPBLK;                  // garis hitam bingkai
      else if (r > 65) {                                               // bingkai emas (dither)
        const chk = (x + y) & 1;
        col = (r > 69 && chk && dx + dy < 0) ? SPGOLD3 : (r > 69 && chk) ? SPGOLD2 : (r <= 69 && chk ? SPGOLD2 : SPGOLD);
        if (r > 69 && !chk) col = SPGOLD;
      } else if (r <= 11) {                                            // tutup tengah
        if (r > 9) col = SPBLK;
        else if ((Math.abs(dx) < 1.6 && Math.abs(dy) < 5) || (Math.abs(dy) < 1.6 && Math.abs(dx) < 5)) col = [138, 75, 0];
        else col = (dx + dy < -4) ? SPGOLD3 : SPGOLD;
      } else {                                                         // segmen hadiah
        let th = Math.atan2(dx, -dy) / rad - rot;
        th = ((th % 360) + 360) % 360;
        const idx = Math.round(th / seg) % n;
        let del = th - idx * seg; if (del > 180) del -= 360; if (del < -180) del += 360;
        const ad = Math.abs(del) * rad, dd = seg / 2 * rad - ad;
        if (r * Math.sin(Math.max(0, dd)) < 1.4) col = SPBLK;          // garis pemisah
        else {
          const u = r * Math.sin(del * rad), v = r * Math.cos(del * rad);
          const cc = SP._rgb[idx % SP._rgb.length], chk = (x + y) & 1;
          col = r < 24 ? cc[1] : (r < 34 && chk) ? cc[1] : (r >= 59 ? cc[2] : cc[0]);
          // koin kecil
          const cu = u, cv2 = v - 55, q = cu * cu + cv2 * cv2;
          if (q <= 25) col = q > 16 ? SPBLK : ((cu + 1.5) * (cu + 1.5) + (cv2 - 1.5) * (cv2 - 1.5) < 2.5 ? SPGOLD3 : SPGOLD);
          // angka hadiah (outline hitam + putih)
          if (v > 30 && v < 51 && Math.abs(u) < 22) {
            const s = txt[idx];
            if (spGlyph(s, u, v)) col = SPWHT;
            else if (spGlyph(s, u - 1, v) || spGlyph(s, u + 1, v) || spGlyph(s, u, v - 1) || spGlyph(s, u, v + 1)) col = SPBLK;
          }
        }
      }
      d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);

  // --- lampu bingkai (kotak piksel) ---
  const nb = 18;
  for (let i = 0; i < nb; i++) {
    const a = i * (Math.PI * 2 / nb) - Math.PI / 2, x = Math.round(cx + Math.cos(a) * 69), y = Math.round(cy + Math.sin(a) * 69);
    const lit = fast ? (i + Math.floor(tm / 70)) % 3 === 0 : (i + Math.floor(tm / 350)) % 2 === 0;
    c.fillStyle = '#000'; c.fillRect(x - 3, y - 3, 6, 6);
    c.fillStyle = lit ? '#f4f4f4' : '#b45f06'; c.fillRect(x - 2, y - 2, 4, 4);
    if (lit) { c.fillStyle = '#73eff7'; c.fillRect(x - 2, y - 2, 1, 1); }
  }

  // --- penunjuk (segitiga piksel) ---
  c.fillStyle = '#000';
  for (let y = 0; y < 22; y++) { const h = 12 - Math.floor(y * 12 / 22); c.fillRect(cx - h, y, h * 2, 1); }
  c.fillStyle = '#b13e53';
  for (let y = 1; y < 18; y++) { const h = 9 - Math.floor((y - 1) * 9 / 17); c.fillRect(cx - h, y, h * 2, 1); }
  c.fillStyle = '#ef7d57'; c.fillRect(cx - 5, 2, 2, 7);
}

A.spin = function () {
  SP.busy = false;
  const ok = spCan();
  ui(`<div id=spw>
<div id=spfx>${spFx()}</div>
<h2>RODA SPIN • ● ${S.coins}</h2>
<div id=swrap><canvas id=sw width=160 height=160></canvas></div>
<p id=sr>${ok ? 'Putar roda dan menangkan koin!' : 'Spin habis! Kalahkan musuh untuk dapat tiket.'}</p>
<p id=si>${spInfo()}</p>
<div class=row><button class=g id=sb data-a=dospin ${ok ? '' : 'disabled'}>${spLabel()}</button><button data-a=menu id=sm>Kembali</button></div>
</div>`);
  const cv = document.getElementById('sw');
  cv.style.setProperty('background', 'transparent', 'important');
  spDraw(cv, SP.rot, 0, false);
  // lampu bingkai berkedip saat roda diam
  let last = 0;
  const idle = t => {
    if (!cv.isConnected) return;
    if (!SP.busy && t - last > 350) { last = t; spDraw(cv, SP.rot, t, false); }
    requestAnimationFrame(idle);
  };
  requestAnimationFrame(idle);
};

A.dospin = function () {
  if (SP.busy || !spCan()) return;
  SP.busy = true;
  const cv = document.getElementById('sw'), sb = document.getElementById('sb'), sm = document.getElementById('sm'),
        sr = document.getElementById('sr'), si = document.getElementById('si');
  sb.disabled = true; sm.disabled = true; sr.textContent = 'Berputar...';

  const idx = spPick(), amt = SP.prizes[idx], seg = 360 / SP.prizes.length;
  // bayar spin & simpan hadiah di awal (anti-curang lewat refresh)
  if (spFree() > 0) { const u = spUsed(); S.spinDay = spToday(); S.spinUsed = u + 1; }
  else S.tix = (S.tix | 0) - SP.tixCost;
  S.coins += amt; save();
  si.textContent = spInfo();

  const from = SP.rot, off = (Math.random() - .5) * seg * .7;
  const to = from - (from % 360) + 360 * 6 - idx * seg + off;
  const t0 = performance.now(), dur = 5000;
  let lastTick = Math.floor((from + seg / 2) / seg);

  const step = now => {
    if (!document.getElementById('sw')) { SP.busy = false; return; }
    const u = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - u, 3);
    SP.rot = from + (to - from) * e;
    spDraw(cv, SP.rot, now - t0, u < .85);
    const tk = Math.floor((SP.rot + seg / 2) / seg);
    if (tk !== lastTick) { lastTick = tk; sfx(700 + (tk % 3) * 60, .04); }
    if (u < 1) { requestAnimationFrame(step); return; }
    SP.busy = false; SP.rot = to % 360;
    sfx(900, .25); setTimeout(() => sfx(1200, .3), 120);
    if (amt >= 200) setTimeout(() => sfx(1500, .35), 260);
    sr.textContent = `Kamu dapat ${amt} koin! ●`; spPop(sr);
    const h = document.querySelector('#ui h2'); if (h) { h.textContent = `RODA SPIN • ● ${S.coins}`; spPop(h); }
    spBurst(amt);
    sm.disabled = false;
    sb.textContent = spLabel(); sb.disabled = !spCan();
    if (!spCan()) sr.textContent += ' Spin habis, cari tiket lagi!';
  };
  requestAnimationFrame(step);
};
