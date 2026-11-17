'use strict';

// ===== MENU TENTANG =====
// Dimuat SETELAH game.js (dan cutscene.js). Edit teks di ABOUT_INFO sesuka hati.
const ABOUT_INFO = {
  maker: '',   // isi namamu, contoh: 'Bintang'. Kosongkan jika tidak ingin ditampilkan.
  game: 'AWAS PELAJARAN MAT! adalah game platformer pixel 8-bit. Bantu karaktermu kabur dari pelajaran matematika lewat 10 dunia: injak monster angka, kumpulkan koin, dan kalahkan bos.',
  make: 'Game ini berjalan langsung di browser tanpa perlu install. Progres, koin, dan isi toko tersimpan di perangkatmu sendiri.',
  mats: 'Bahan: HTML5 Canvas, JavaScript, CSS, dan Web Audio API. Semua gambar pixel dan musik 8-bit dibuat langsung dari kode, tanpa file gambar atau audio.'
};

(() => {
  const st = document.createElement('style');
  st.textContent = `.abt{right:2cqw;top:19.8cqw}.abt button{font-style:italic;font-family:Georgia,serif}.abo p{font-size:1.7cqw;max-width:72cqw;line-height:1.4}.abo b{color:#7ad7ff}`;
  document.head.appendChild(st);
})();

// --- tombol "i" di bawah tombol cerita ---
const abtMenu = menu;
menu = function () {
  abtMenu();
  U.insertAdjacentHTML('beforeend', '<div class="lb abt"><button class=ic data-a=about aria-label=Tentang>i</button></div>');
};
A.menu = menu;

A.about = function () {
  const I = ABOUT_INFO;
  ui(`<h2>TENTANG</h2>
<div class=abo>
<p><b>Tentang Game</b><br>${I.game}</p>
<p><b>Pembuatan</b><br>${I.maker ? 'Dibuat oleh ' + I.maker + '. ' : ''}${I.make}</p>
<p><b>Bahan</b><br>${I.mats}</p>
</div>
<button data-a=menu>Kembali</button>`);
};

menu();   // gambar ulang beranda supaya tombol muncul
