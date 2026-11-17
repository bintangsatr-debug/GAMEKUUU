'use strict';

// ===== MENU CERITA (CUTSCENE) =====
// Dimuat SETELAH game.js (dan cheat.js). Tidak perlu mengedit game.js.
(() => {
  const st = document.createElement('style');
  st.textContent = `.cts{right:2cqw;top:14.2cqw}.csl button{min-width:17cqw;font-size:1.7cqw;padding:.5cqw 1cqw;line-height:1.2}.csl small{font-size:1.1cqw;display:block}`;
  document.head.appendChild(st);
})();

// --- tombol 🎬 di bawah tombol cheat ---
const cstmMenu = menu;
menu = function () {
  cstmMenu();
  U.insertAdjacentHTML('beforeend', '<div class="lb cts"><button class=ic data-a=cutmenu aria-label=Cerita>🎬</button></div>');
};
A.menu = menu;

A.cutmenu = function () {
  st = 'menu';
  let b = '';
  for (let i = 1; i <= 10; i++) {
    const has = !!CS[i];
    b += `<button class=${has ? 'g' : ''} data-a=cutlv data-n=${i} ${has ? '' : 'disabled'}>Level ${i}<small>${L[i - 1].n}</small></button>`;
  }
  ui(`<h2>🎬 CERITA</h2>
<p>Pilih level untuk menonton cutscene-nya.</p>
<div class="row csl">${b}</div>
<p>Level tanpa cutscene tidak bisa dipilih.</p>
<button data-a=menu>Kembali</button>`);
};

A.cutlv = function (n) {
  const c = CS[+n];
  if (!c) return;
  const scenes = [...(c.pre || []), ...(c.post || [])];
  if (!scenes.length) return;
  trans(() => cut(scenes, () => menu()));
};

menu();   // gambar ulang beranda supaya tombol muncul
