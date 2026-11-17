'use strict';

// ===== MENU CHEAT (pakai password) =====
// Dimuat SETELAH game.js dan spin.js
const CH = { pass: 'gamebintang', ok: false, coins: 999999 };

(() => {
  const st = document.createElement('style');
  st.textContent = `.cht{right:2cqw;top:8.6cqw}`;
  document.head.appendChild(st);
})();

// --- sisipkan tombol 🦠 di bawah tombol pengaturan (tanpa edit game.js) ---
const chMenu = menu;
menu = function () {
  chMenu();
  U.insertAdjacentHTML('beforeend', '<div class="lb cht"><button class=ic data-a=cheat aria-label=Cheat>🦠</button></div>');
};
A.menu = menu;

// --- kebal musuh (jatuh ke jurang tetap kembali ke checkpoint) ---
const chHurt = hurt;
hurt = function () {
  if (S.chInv) {
    if (P.y > H + 80) { P.x = P.cp.x; P.y = P.cp.y; P.vx = P.vy = 0; P.inv = 1; }
    return;
  }
  chHurt();
};

// --- koin tak terbatas: belanja di toko tidak mengurangi koin ---
const chBuy = A.buy;
A.buy = function (id) {
  if (S.chCoin) S.coins = CH.coins;
  chBuy(id);
  if (S.chCoin) { S.coins = CH.coins; save(); A.shop(); }
};

A.cheat = function () {
  if (!CH.ok) {
    const p = prompt('Masukkan password cheat:');
    if (p === null) return;
    if (p !== CH.pass) { sfx(150, .3, 'sawtooth'); alert('Password salah!'); return; }
    CH.ok = true; sfx(900, .15);
  }
  ui(`<h2>🦠 CHEAT</h2>
<div class=row><button class=${S.chCoin ? 'g' : 'r'} data-a=chcoin>Koin Tak Terbatas: ${S.chCoin ? 'ON' : 'OFF'}</button></div>
<div class=row><button class=${S.chInv ? 'g' : 'r'} data-a=chinv>Kebal Musuh: ${S.chInv ? 'ON' : 'OFF'}</button></div>
<button data-a=menu>Kembali</button>`);
};

A.chcoin = function () {
  if (!CH.ok) return;
  if (S.chCoin) { S.chCoin = false; S.coins = S.chBk | 0; }   // matikan: koin kembali seperti semula
  else { S.chCoin = true; S.chBk = S.coins; S.coins = CH.coins; }
  save(); A.cheat();
};

A.chinv = function () {
  if (!CH.ok) return;
  S.chInv = !S.chInv; save(); A.cheat();
};

menu();   // gambar ulang beranda supaya tombol cheat muncul
