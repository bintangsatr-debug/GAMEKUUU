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