'use strict';

// ===== MENU CHEAT (pakai password) =====
// Dimuat SETELAH game.js dan spin.js. Tidak perlu mengedit game.js.
const CH = { pass: 'gamebintang', ok: false, coins: 999999, speed: 2, msg: '' };

(() => {
  const st = document.createElement('style');
  st.textContent = `.cht{right:2cqw;top:8.6cqw}.ch button{min-width:31cqw;font-size:1.7cqw;padding:.5cqw 1cqw}`;
  document.head.appendChild(st);
})();

// --- tombol 🦠 di bawah tombol pengaturan ---
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

// --- jalan cepat: kecepatan pemain dikali CH.speed saat bergerak ---
const chMove = move;
move = function (o, dt) {
  if (S.chSpd && o === P) { const v = o.vx; o.vx = v * CH.speed; chMove(o, dt); o.vx = v; }
  else chMove(o, dt);
};

// --- hilangkan musuh / boss (dicek tiap frame) ---
const chUpdate = update;
update = function (dt) {
  if (S.chNoBoss && boss && !boss.dead) { boss.dead = 1; boss.dt = 0; }
  if (S.chNoEn || S.chNoBoss) en = en.filter(e => e.big ? !S.chNoBoss : !S.chNoEn);
  chUpdate(dt);
};

// --- koin tak terbatas: belanja di toko tidak mengurangi koin ---
const chBuy = A.buy;
A.buy = function (id) {
  if (S.chCoin) S.coins = CH.coins;
  chBuy(id);
  if (S.chCoin) { S.coins = CH.coins; save(); A.shop(); }
};

const onoff = k => S[k] ? 'ON' : 'OFF', cls = k => S[k] ? 'g' : 'r';

A.cheat = function () {
  if (!CH.ok) {
    const p = prompt('Masukkan password cheat:');
    if (p === null) return;
    if (p !== CH.pass) { sfx(150, .3, 'sawtooth'); alert('Password salah!'); return; }
    CH.ok = true; sfx(900, .15);
  }
  const m = CH.msg; CH.msg = '';
  ui(`<h2>🦠 CHEAT</h2>
<div class="row ch">
<button class=${cls('chCoin')} data-a=chcoin>Koin Tak Terbatas: ${onoff('chCoin')}</button>
<button class=${cls('chInv')} data-a=chtog data-n=chInv>Kebal Musuh: ${onoff('chInv')}</button>
<button class=${cls('chSpd')} data-a=chtog data-n=chSpd>Jalan Cepat: ${onoff('chSpd')}</button>
<button class=${cls('chNoEn')} data-a=chtog data-n=chNoEn>Hilangkan Musuh: ${onoff('chNoEn')}</button>
<button class=${cls('chNoBoss')} data-a=chtog data-n=chNoBoss>Hilangkan Boss: ${onoff('chNoBoss')}</button>
<button class=o data-a=chlv>Buka Semua Level</button>
<button class=o data-a=chshop>Buka Semua Item Shop</button>
</div>
<p>${m}</p>
<button data-a=menu>Kembali</button>`);
};

A.chcoin = function () {
  if (!CH.ok) return;
  if (S.chCoin) { S.chCoin = false; S.coins = S.chBk | 0; }   // dimatikan: koin kembali seperti semula
  else { S.chCoin = true; S.chBk = S.coins; S.coins = CH.coins; }
  save(); A.cheat();
};

A.chtog = function (k) {
  if (!CH.ok || !['chInv', 'chSpd', 'chNoEn', 'chNoBoss'].includes(k)) return;
  S[k] = !S[k]; sfx(S[k] ? 800 : 400, .08); save(); A.cheat();
};

A.chlv = function () {
  if (!CH.ok) return;
  for (let i = 1; i <= 9; i++) if (!S.done.includes(i)) S.done.push(i);
  sfx(900, .2); save(); CH.msg = 'Semua level terbuka! (cek di Pilih Level)'; A.cheat();
};

A.chshop = function () {
  if (!CH.ok) return;
  IT.forEach(it => { if (!S.owned.includes(it.id)) S.owned.push(it.id); });
  sfx(900, .2); save(); CH.msg = 'Semua item shop terbuka!'; A.cheat();
};

menu();   // gambar ulang beranda supaya tombol cheat muncul
