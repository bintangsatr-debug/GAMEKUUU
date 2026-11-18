'use strict';

// ===== RODA SPIN KOIN + TIKET (versi tampilan baru) =====
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
  if (document.getElementById('spcss')) return;
  const st = document.createElement('style');
  st.id = 'spcss';
  st.textContent = `
/* --- hilangkan kotak hitam: panel #ui jadi transparan saat layar spin tampil --- */
#ui:has(#spw){background:none!important;border:none!important;box-shadow:none!important;backdrop-filter:none!important;outline:none!important}

#spw{position:relative;display:flex;flex-direction:column;align-items:center;gap:1.1cqw;
  background:radial-gradient(ellipse at 50% 45%,rgba(142,68,173,.55) 0%,rgba(58,134,255,.18) 45%,rgba(0,0,0,0) 72%)}
#spw>*:not(#spfx){position:relative;z-index:1}

/* judul */
#spw h2{margin:0;font-size:3.2cqw;letter-spacing:.2cqw;color:#ffd93b;
  text-shadow:0 .35cqw 0 #8a4b00,0 0 1.8cqw #ff9f1c,0 0 .4cqw #000;transition:transform .2s}
#spw h2.pop{animation:sppop .45s ease}

/* roda */
#swrap{position:relative;width:29cqw;height:29cqw;filter:drop-shadow(0 0 1.6cqw rgba(255,217,59,.55));
  animation:spglow 2.6s ease-in-out infinite}
#swrap.win{animation:spflash 1.1s ease-out}
#sw{width:100%;height:100%;display:block;background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;outline:none!important;image-rendering:auto}

/* teks hasil & info */
#sr{margin:0;min-height:2.8cqw;font-size:2.3cqw;font-weight:bold;color:#ffd93b;
  text-shadow:.2cqw .2cqw 0 #000,-.2cqw .2cqw 0 #000,.2cqw -.2cqw 0 #000,-.2cqw -.2cqw 0 #000}
#sr.pop{animation:sppop .5s ease}
#si{margin:0;font-size:1.6cqw;color:#c9f0ff;padding:.5cqw 1.8cqw;border-radius:5cqw;
  background:linear-gradient(90deg,rgba(58,134,255,.35),rgba(142,68,173,.35));
  border:.2cqw solid rgba(255,255,255,.35)}

/* tombol */
#spw .row{display:flex;gap:1.6cqw;justify-content:center;margin-top:.4cqw}
#spw button{position:relative;overflow:hidden;font:inherit;font-weight:bold;font-size:2.2cqw;color:#fff;
  padding:1.1cqw 3.4cqw;border-radius:5cqw;border:.4cqw solid #000;cursor:pointer;
  text-shadow:0 .2cqw 0 rgba(0,0,0,.55);box-shadow:0 .7cqw 0 #000,0 1.2cqw 1.6cqw rgba(0,0,0,.4);
  transition:transform .12s,box-shadow .12s,filter .2s}
#spw button::before{content:'';position:absolute;left:8%;right:8%;top:6%;height:42%;border-radius:5cqw;
  background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0))}
#spw button::after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:30%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);
  transform:skewX(-20deg);animation:spshine 3s ease-in-out infinite}
#spw button#sb{background:linear-gradient(#5be37d,#1f9d45);font-size:2.6cqw;padding:1.2cqw 4.4cqw;
  animation:spbeat 1.4s ease-in-out infinite}
#spw button#sm{background:linear-gradient(#9b6bff,#5b34c9)}
#spw button#sm::after{animation-delay:1.2s}
#spw button:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-.2cqw)}
#spw button:active:not(:disabled){transform:translateY(.6cqw);box-shadow:0 .1cqw 0 #000}
#spw button:disabled{filter:grayscale(.85) brightness(.7);cursor:not-allowed;animation:none}
#spw button:disabled::after{display:none}

/* koin melayang & kilau */
#spfx{position:absolute;inset:-4cqw -8cqw;z-index:0;pointer-events:none;overflow:hidden}
.fc{position:absolute;top:105%;aspect-ratio:1;animation:spfloat linear infinite}
.fc b{display:block;width:100%;height:100%;border-radius:50%;
  background:radial-gradient(circle at 32% 30%,#fffbc4,#ffd93b 45%,#c98a00);
  border:.25cqw solid #8a5a00;box-shadow:0 0 1.2cqw rgba(255,217,59,.8);
  animation:spflip 1.7s ease-in-out infinite,spsway 3.4s ease-in-out infinite}
.fc b::after{content:'';position:absolute;inset:22%;border-radius:50%;border:.2cqw solid rgba(138,90,0,.55)}
.ks{position:absolute;color:#fff;font-style:normal;line-height:1;text-shadow:0 0 1cqw currentColor;
  animation:sptwinkle ease-in-out infinite;opacity:0}
.bc{position:absolute;left:50%;top:50%;width:3cqw;height:3cqw;border-radius:50%;z-index:3;pointer-events:none;
  background:radial-gradient(circle at 32% 30%,#fffbc4,#ffd93b 45%,#c98a00);border:.25cqw solid #8a5a00;
  box-shadow:0 0 1.2cqw rgba(255,217,59,.9);animation:spburst 1.3s ease-out forwards}
.bs{position:absolute;left:50%;top:50%;z-index:3;pointer-events:none;font-style:normal;font-size:3cqw;
  text-shadow:0 0 1cqw currentColor;animation:spburst 1.3s ease-out forwards}

@keyframes spfloat{0%{top:105%;opacity:0}8%{opacity:1}88%{opacity:1}100%{top:-12%;opacity:0}}
@keyframes spflip{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.18)}}
@keyframes spsway{0%,100%{margin-left:-1.4cqw}50%{margin-left:1.4cqw}}
@keyframes sptwinkle{0%,100%{opacity:0;transform:scale(.2) rotate(0)}50%{opacity:1;transform:scale(1) rotate(90deg)}}
@keyframes spshine{0%,60%{left:-60%}100%{left:140%}}
@keyframes spbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes spglow{0%,100%{filter:drop-shadow(0 0 1.2cqw rgba(255,217,59,.45))}50%{filter:drop-shadow(0 0 2.6cqw rgba(255,217,59,.9))}}
@keyframes spflash{0%{filter:drop-shadow(0 0 1cqw #fff) brightness(1)}20%{filter:drop-shadow(0 0 4cqw #fff) brightness(1.5)}100%{filter:drop-shadow(0 0 1.6cqw rgba(255,217,59,.55)) brightness(1)}}
@keyframes sppop{0%{transform:scale(1)}35%{transform:scale(1.35)}100%{transform:scale(1)}}
@keyframes spburst{
  0%{transform:translate(-50%,-50%) scale(.3) rotate(0);opacity:1}
  55%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1) rotate(180deg);opacity:1}
  100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy) + 12cqw)) scale(.8) rotate(360deg);opacity:0}}
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

// koin melayang + kilau di latar layar spin
function spFx() {
  let h = '';
  for (let i = 0; i < 10; i++) {
    const sz = 2.2 + Math.random() * 2, dur = 7 + Math.random() * 6;
    h += `<i class=fc style="left:${(4 + Math.random() * 90).toFixed(1)}%;width:${sz.toFixed(1)}cqw;` +
         `animation-duration:${dur.toFixed(1)}s;animation-delay:-${(Math.random() * dur).toFixed(1)}s"><b style="animation-delay:-${(Math.random() * 3).toFixed(1)}s"></b></i>`;
  }
  const cs = ['#ffffff', '#ffd93b', '#7ad7ff', '#ffb3f0'];
  for (let i = 0; i < 16; i++) {
    h += `<i class=ks style="left:${(Math.random() * 96).toFixed(1)}%;top:${(Math.random() * 92).toFixed(1)}%;` +
         `font-size:${(1.4 + Math.random() * 2.2).toFixed(1)}cqw;color:${cs[i % cs.length]};` +
         `animation-duration:${(1.6 + Math.random() * 1.8).toFixed(1)}s;animation-delay:-${(Math.random() * 3).toFixed(1)}s">✦</i>`;
  }
  return h;
}

// ledakan koin saat menang
function spBurst(amt) {
  const w = document.getElementById('swrap'); if (!w) return;
  const n = amt >= 200 ? 26 : 14, cs = ['#ffffff', '#ffd93b', '#7ad7ff', '#ffb3f0'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 8 + Math.random() * 14;
    const el = document.createElement('i');
    el.className = i % 3 === 0 ? 'bs' : 'bc';
    if (i % 3 === 0) { el.textContent = '✦'; el.style.color = cs[i % cs.length]; }
    el.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'cqw');
    el.style.setProperty('--dy', (Math.sin(a) * d - 4).toFixed(1) + 'cqw');
    el.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
    w.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
  w.classList.remove('win'); void w.offsetWidth; w.classList.add('win');
  setTimeout(() => w.classList.remove('win'), 1200);
}

function spPop(el) { if (!el) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

function spDraw(cv, rot, tm, fast) {
  tm = tm || 0;
  const c = cv.getContext('2d'), cx = 200, cy = 200, R = 168, n = SP.prizes.length, seg = 360 / n, rad = Math.PI / 180;
  c.clearRect(0, 0, 400, 400);

  // --- roda (berputar) ---
  c.save(); c.translate(cx, cy); c.rotate(rot * rad); c.lineJoin = 'round';
  const sh = c.createRadialGradient(0, 0, 10, 0, 0, R);
  sh.addColorStop(0, 'rgba(255,255,255,.38)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  for (let i = 0; i < n; i++) {
    const a0 = (-90 + i * seg - seg / 2) * rad, a1 = a0 + seg * rad;
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, a0, a1); c.closePath();
    c.fillStyle = SP.cols[i % SP.cols.length]; c.fill();
    c.fillStyle = sh; c.fill();
    c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
    c.save(); c.rotate(i * seg * rad);
    c.textAlign = 'center'; c.font = 'bold 34px monospace'; c.lineWidth = 5; c.strokeStyle = '#000';
    const t = String(SP.prizes[i]);
    c.strokeText(t, 0, -R + 62); c.fillStyle = '#fff'; c.fillText(t, 0, -R + 62);
    // koin kecil di tiap kotak hadiah
    c.beginPath(); c.arc(0, -R + 28, 12, 0, 7);
    c.fillStyle = '#ffd93b'; c.fill(); c.lineWidth = 3; c.stroke();
    c.beginPath(); c.arc(-3, -R + 25, 4, 0, 7); c.fillStyle = 'rgba(255,255,255,.8)'; c.fill();
    c.restore();
  }
  c.restore();

  // --- bingkai emas + lampu (diam) ---
  const g = c.createLinearGradient(0, 0, 400, 400);
  g.addColorStop(0, '#fff2a8'); g.addColorStop(.5, '#e0a100'); g.addColorStop(1, '#fff2a8');
  c.beginPath(); c.arc(cx, cy, 182, 0, 7); c.lineWidth = 26; c.strokeStyle = g; c.stroke();
  c.lineWidth = 4; c.strokeStyle = '#000';
  c.beginPath(); c.arc(cx, cy, 169, 0, 7); c.stroke();
  c.beginPath(); c.arc(cx, cy, 195, 0, 7); c.stroke();
  const nb = 18;
  for (let i = 0; i < nb; i++) {
    const a = i * (Math.PI * 2 / nb) - Math.PI / 2, x = cx + Math.cos(a) * 182, y = cy + Math.sin(a) * 182;
    const lit = fast ? (i + Math.floor(tm / 70)) % 3 === 0 : (i + Math.floor(tm / 350)) % 2 === 0;
    c.beginPath(); c.arc(x, y, 7, 0, 7);
    if (lit) { c.shadowColor = '#fff27a'; c.shadowBlur = 14; c.fillStyle = '#fffbd0'; }
    else { c.shadowBlur = 0; c.fillStyle = '#a8740a'; }
    c.fill(); c.shadowBlur = 0; c.lineWidth = 2; c.strokeStyle = '#000'; c.stroke();
  }

  // --- tutup tengah ---
  const hg = c.createRadialGradient(cx - 8, cy - 8, 3, cx, cy, 30);
  hg.addColorStop(0, '#fffbc4'); hg.addColorStop(.6, '#ffd93b'); hg.addColorStop(1, '#c98a00');
  c.beginPath(); c.arc(cx, cy, 28, 0, 7); c.fillStyle = hg; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = 'bold 26px monospace';
  c.fillStyle = '#8a4b00'; c.fillText('★', cx, cy + 1); c.textBaseline = 'alphabetic';

  // --- penunjuk ---
  c.beginPath(); c.moveTo(cx - 22, 0); c.lineTo(cx + 22, 0); c.lineTo(cx, 58); c.closePath();
  c.fillStyle = '#e63946'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
  c.beginPath(); c.moveTo(cx - 12, 6); c.lineTo(cx - 2, 6); c.lineTo(cx - 2, 30); c.closePath();
  c.fillStyle = 'rgba(255,255,255,.45)'; c.fill();
}

A.spin = function () {
  SP.busy = false;
  const ok = spCan();
  ui(`<div id=spw>
<div id=spfx>${spFx()}</div>
<h2>RODA SPIN • ● ${S.coins}</h2>
<div id=swrap><canvas id=sw width=400 height=400></canvas></div>
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
    if (!SP.busy && t - last > 150) { last = t; spDraw(cv, SP.rot, t, false); }
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
