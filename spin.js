'use strict';

// ===== RODA SPIN KOIN + TIKET =====
// Dimuat SETELAH game.js (memakai S, A, ui, save, sfx dari game.js)
const SP = {
  prizes: [10, 50, 100, 200, 300, 1000],
  weights: [35, 25, 20, 12, 6, 2],   // peluang (%) tiap hadiah
  cols: ['#ff9f1c', '#3a86ff', '#2a9d4a', '#8e44ad', '#e63946', '#ffd93b'],
  freePerDay: 5,                     // spin gratis per hari
  tixCost: 10,                       // tiket yang dibutuhkan untuk 1 spin ekstra
  rot: 0,
  busy: false
};

(() => {
  const st = document.createElement('style');
  st.textContent = `
button.y{background:#8e44ad}
#sw{width:29cqw;height:29cqw}
#sr{min-height:2.6cqw;color:#ffd93b}
#si{font-size:1.7cqw;color:#7ad7ff}
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

function spDraw(cv, rot) {
  const c = cv.getContext('2d'), cx = 200, cy = 200, R = 188, n = SP.prizes.length, seg = 360 / n, rad = Math.PI / 180;
  c.clearRect(0, 0, 400, 400);
  c.save(); c.translate(cx, cy); c.rotate(rot * rad); c.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    const a0 = (-90 + i * seg - seg / 2) * rad, a1 = a0 + seg * rad;
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, a0, a1); c.closePath();
    c.fillStyle = SP.cols[i % SP.cols.length]; c.fill();
    c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
    c.save(); c.rotate(i * seg * rad);
    c.textAlign = 'center'; c.font = 'bold 34px monospace'; c.lineWidth = 5; c.strokeStyle = '#000';
    const t = String(SP.prizes[i]);
    c.strokeText(t, 0, -R + 62); c.fillStyle = '#fff'; c.fillText(t, 0, -R + 62);
    c.fillStyle = '#ffd93b'; c.lineWidth = 3;
    c.beginPath(); c.arc(0, -R + 30, 11, 0, 7); c.fill(); c.stroke();
    c.restore();
  }
  c.beginPath(); c.arc(0, 0, R, 0, 7); c.lineWidth = 8; c.strokeStyle = '#000'; c.stroke();
  c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 5; c.stroke();
  c.restore();
  c.beginPath(); c.moveTo(cx - 20, 2); c.lineTo(cx + 20, 2); c.lineTo(cx, 50); c.closePath();
  c.fillStyle = '#e63946'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
}

A.spin = function () {
  SP.busy = false;
  const ok = spCan();
  ui(`<h2>RODA SPIN • ● ${S.coins}</h2>
<canvas id=sw width=400 height=400></canvas>
<p id=sr>${ok ? 'Putar roda dan menangkan koin!' : Tiket habis! Kalahin BOSS buat dapat tiket.'}</p>
<p id=si>${spInfo()}</p>
<div class=row><button class=g id=sb data-a=dospin ${ok ? '' : 'disabled'}>${spLabel()}</button><button data-a=menu id=sm>Kembali</button></div>`);
  spDraw(document.getElementById('sw'), SP.rot);
};

A.dospin = function () {
  if (SP.busy || !spCan()) return;
  SP.busy = true;
  const cv = document.getElementById('sw'), sb = document.getElementById('sb'), sm = document.getElementById('sm'),
        sr = document.getElementById('sr'), si = document.getElementById('si');
  sb.disabled = true; sm.disabled = true; sr.textContent = 'OTW wkwkwk...';

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
    spDraw(cv, SP.rot);
    const tk = Math.floor((SP.rot + seg / 2) / seg);
    if (tk !== lastTick) { lastTick = tk; sfx(700 + (tk % 3) * 60, .04); }
    if (u < 1) { requestAnimationFrame(step); return; }
    SP.busy = false; SP.rot = to % 360;
    sfx(900, .25); setTimeout(() => sfx(1200, .3), 120);
    sr.textContent = `Nih dapet ${amt} koin! ●`;
    const h = document.querySelector('#ui h2'); if (h) h.textContent = `RODA SPIN • ● ${S.coins}`;
    sm.disabled = false;
    sb.textContent = spLabel(); sb.disabled = !spCan();
    if (!spCan()) sr.textContent += ' Spin habis, cari tiket lagi!';
  };
  requestAnimationFrame(step);
};
