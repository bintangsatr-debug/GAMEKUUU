'use strict';
/* ============================================================
   SHOP.JS — semua yang berhubungan dengan TOKO:
   1) IT            : daftar item (id, nama, kategori, harga)
   2) chr() + draw* : gambar karakter & aksesoris di game
   3) prev()        : ikon preview item di kartu toko
   4) shopCard()    : tampilan kartu item di toko
   5) SHOP.shop()   : halaman toko (kiri = daftar item per tab,
                      kanan = preview item yang dipilih + tombol aksi)
   6) SHOP.buy()    : logika tab / preview / beli / pakai / lepas
   Tab/kategori: Karakter, Aksesoris, Senjata (daftar di CATS)

   ALUR TOKO:
   - Tap kartu item  -> hanya PREVIEW (data-n="sel:ID"), tidak membeli.
   - Item belum dibeli tampil dengan GEMBOK (di kartu & di preview).
   - Tombol di panel kanan: Beli / Pakai / Lepas (data-n="ID").
   - Setelah membeli, gembok memainkan animasi TERBUKA lalu hilang.

   Dimuat SEBELUM game.js. Memakai dari game.js (dipanggil saat
   runtime): S, ui, save, sfx, st, A, C, W
   Dipakai game.js: chr, IT, eq, SHOP
   Dipakai cutscene.js: chr

   ---- CARA TAMBAH ITEM ----
   KARAKTER BARU:
     a. Tambah baris di IT: {id:'polisi',n:'Polisi',cat:'Karakter',p:250}
     b. Tambah cabang  else if(sk=='polisi'){...}  di fungsi chr()
        (sebelum  else{  paling bawah, yaitu skin SMA/default)
     c. (opsional) tambah nama di objek NM pada cutscene.js
        supaya nama muncul di dialog cutscene
     Preview di toko otomatis dibuat dari chr().
   SENJATA BARU:
     a. Tambah baris di IT dengan cat:'Senjata'
        (otomatis tampil di tab Senjata; dipilih disimpan di S.weapon)
     b. Gambar senjata di game belum ada: tambahkan sendiri di chr()
        dengan cek  S.weapon=='idsenjata'  dan preview di prev()
   AKSESORIS BARU:
     a. Tambah baris di IT dengan cat:'Aksesoris'
     b. Buat fungsi drawXxx() dan panggil di akhir chr()
        (cek list.includes('idbaru'))
     c. Tambah cabang preview  else if(id=='idbaru'){...}  di prev()
   ============================================================ */

// ===== DAFTAR ITEM TOKO =====
const IT=[
  {id:'pensil',n:'Pensil',cat:'Karakter',p:0},
  {id:'sd',n:'Siswa SD',cat:'Karakter',p:80},
  {id:'sma',n:'Siswa SMA',cat:'Karakter',p:150},
  {id:'kopdes',n:'Petugas Kopdes',cat:'Karakter',p:180},
  {id:'ojol',n:'Ojek Online',cat:'Karakter',p:200},
  {id:'buku',n:'Buku Tulis',cat:'Karakter',p:120},
  {id:'dokter',n:'Dokter',cat:'Karakter',p:220},
  {id:'tni',n:'TNI',cat:'Karakter',p:250},
  {id:'ultramen',n:'Ultramen',cat:'Karakter',p:300},
  {id:'sepatu',n:'Sepatu Biru',cat:'Aksesoris',p:100},
  {id:'burger',n:'Burger Kepala',cat:'Aksesoris',p:120},
  {id:'jam',n:'Jam Tangan',cat:'Aksesoris',p:140},
  {id:'sayap',n:'Sayap',cat:'Aksesoris',p:160},
  {id:'topi',n:'Topi',cat:'Aksesoris',p:110},
  {id:'dasi',n:'Dasi',cat:'Aksesoris',p:90}
];
const eq=it=>it.cat=='Karakter'?S.skin==it.id:it.cat=='Senjata'?S.weapon==it.id:S.acc.includes(it.id);

// ===== KARAKTER & AKSESORIS =====
function drawWings(c,wk){
  const fl=Math.round(wk*1.5);
  c.fillStyle='#1b1b1b';
  c.fillRect(-17,6-fl,11,5);c.fillRect(-19,9-fl,12,5);c.fillRect(-16,14-fl,9,4);c.fillRect(-13,18-fl,6,3);
  c.fillStyle='#bfe9ff';
  c.fillRect(-16,7-fl,9,3);c.fillRect(-18,10-fl,10,3);c.fillRect(-15,14-fl,7,3);
  c.fillStyle='#ffffff';
  c.fillRect(-15,7-fl,7,2);c.fillRect(-17,10-fl,8,2);c.fillRect(-14,14-fl,5,2);c.fillRect(-12,18-fl,4,2);
}
function drawHat(c,cx,by){
  c.fillStyle='#1b1b1b';
  c.fillRect(cx-9,by-3,18,3);
  c.fillRect(cx-7,by-8,14,6);
  c.fillStyle='#2980b9';
  c.fillRect(cx-8,by-2,16,1);
  c.fillRect(cx-6,by-7,12,5);
  c.fillStyle='#54a0ff';
  c.fillRect(cx-5,by-7,4,3);
  c.fillStyle='#ffd93b';
  c.fillRect(cx-6,by-4,12,2);
}
function drawTie(c,tx,ty){
  c.fillStyle='#1b1b1b';
  c.fillRect(tx-2,ty,5,3);
  c.fillRect(tx-1,ty+3,3,5);
  c.fillRect(tx,ty+8,1,1);
  c.fillStyle='#e63946';
  c.fillRect(tx-1,ty+1,3,2);
  c.fillRect(tx,ty+3,1,5);
  c.fillStyle='#ff7675';
  c.fillRect(tx,ty+1,1,1);
}
function drawBurger(c,cx,by){
  c.fillStyle='#1b1b1b';c.fillRect(cx-8,by-3,16,3);
  c.fillStyle='#d9822b';c.fillRect(cx-7,by-2,14,2);
  c.fillStyle='#1b1b1b';c.fillRect(cx-9,by-5,18,3);
  c.fillStyle='#5c2c16';c.fillRect(cx-8,by-4,16,2);
  c.fillStyle='#ffd93b';c.fillRect(cx-8,by-5,16,1);c.fillRect(cx-5,by-4,2,2);c.fillRect(cx+3,by-4,2,1);
  c.fillStyle='#4cd137';c.fillRect(cx-8,by-6,16,1);
  c.fillStyle='#e84118';c.fillRect(cx-6,by-7,12,1);
  c.fillStyle='#1b1b1b';c.fillRect(cx-8,by-10,16,3);c.fillRect(cx-6,by-11,12,1);
  c.fillStyle='#f39c12';c.fillRect(cx-7,by-9,14,2);c.fillRect(cx-5,by-10,10,1);
  c.fillStyle='#fff6d6';c.fillRect(cx-3,by-9,1,1);c.fillRect(cx+1,by-10,1,1);c.fillRect(cx+4,by-9,1,1);
}
function drawWatch(c,wx,wy){
  c.fillStyle='#1b1b1b';c.fillRect(wx-1,wy-1,5,5);
  c.fillStyle='#ffd93b';c.fillRect(wx,wy,3,3);
  c.fillStyle='#0984e3';c.fillRect(wx+1,wy+1,1,1);
}

function chr(c,sk,acc,wk){
  wk=wk||0;
  const list=Array.isArray(acc)?acc:(acc?[acc]:[]);
  const hasShoe=list.includes('sepatu'),hasBurger=list.includes('burger'),hasWatch=list.includes('jam'),
        hasWings=list.includes('sayap'),hasHat=list.includes('topi'),hasTie=list.includes('dasi');
  const a=wk*2,r=(k,x,y,w,h)=>{c.fillStyle=k;c.fillRect(x,y,w,h)},o=(k,x,y,w,h)=>{r('#1b1b1b',x-1,y-1,w+2,h+2);r(k,x,y,w,h)},
    shoe=(x,y)=>{r(hasShoe?'#1e6fff':'#2b2b2b',x,y,7,3);r(hasShoe?'#0b2a66':'#000',x,y+3,7,1)};
  let topY=-2,watchPos=[2,16],tiePos=[2,12];

  if(hasWings)drawWings(c,wk);

  if(sk=='pensil'){
    r('#ff7aa2',-10,-2,20,6);r('#b0b8c4',-10,4,20,4);r('#8a93a1',-10,6,20,1);r('#ffd93b',-10,8,20,14);r('#f0a800',-10,8,4,14);
    c.fillStyle='#f2c28b';c.beginPath();c.moveTo(-10,22);c.lineTo(10,22);c.lineTo(0,31);c.fill();c.fillStyle='#333';c.beginPath();c.moveTo(-3,28);c.lineTo(3,28);c.lineTo(0,31);c.fill();
    r('#000',-3,12,3,4);r('#000',3,12,3,4);r('#c0392b',-2,18,6,1);
    if(hasShoe){shoe(-11+a,27);shoe(4-a,27)}
    if(hasWatch){o('#ffd93b',7,14,4,5);r('#f2c28b',8,15,2,3);watchPos=[7,15]}
    tiePos=[0,20];topY=-2;
  }else if(sk=='buku'){
    o('#1e3799',-9,-1,18,24);
    r('#3498db',-8,0,15,22);r('#2980b9',-8,0,4,22);
    r('#f5f6fa',7,1,2,20);r('#bdc3c7',7,5,2,1);r('#bdc3c7',7,10,2,1);r('#bdc3c7',7,15,2,1);
    for(let sy=2;sy<=18;sy+=4){r('#1b1b1b',-11,sy,4,2);r('#dfe6e9',-10,sy,2,1)}
    r('#fff',-3,2,9,5);r('#e63946',-2,3,7,1);
    r('#000',-1,10,2,4);r('#000',4,10,2,4);r('#c0392b',0,16,5,1);
    o('#2c3e50',-6+a,23,4,4);o('#2c3e50',2-a,23,4,4);shoe(-7+a,27);shoe(1-a,27);
    if(hasWatch){o('#f2c28b',8,13,4,5);watchPos=[8,14]}
    tiePos=[2,18];topY=-2;
  }else if(sk=='sd'){
    o('#f2c28b',-5+a,24,4,4);o('#f2c28b',1-a,24,4,4);o('#d62839',-6,18,12,7);o('#fff',-6,11,12,8);r('#d62839',-1,12,3,5);
    o('#f2c28b',-6,0,12,11);r('#222',-7,2,3,6);r('#d62839',-7,-3,14,5);r('#b01e2e',5,1,6,2);
    r('#000',2,5,2,3);r('#c0392b',2,9,3,1);shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#f2c28b',1-a*.5,14,4,5);watchPos=[1-a*.5,16]}
    tiePos=[1,12];topY=-3;
  }else if(sk=='kopdes'){
    o('#2a9d4a',-11,13,5,9);r('#fff',-10,14,3,2);
    o('#4a3b2c',-5+a,21,4,8);o('#4a3b2c',1-a,21,4,8);
    o('#b5894c',-7,11,14,10);r('#8f6834',-7,19,14,2);
    r('#d4a76a',-2,11,4,4);r('#ffd93b',2,13,2,2);r('#e63946',2,15,2,1);
    o('#f2c28b',-6,0,12,11);r('#222',-7,2,2,5);
    o('#1b1b1b',-7,-4,14,5);r('#3a3a3a',-6,-3,12,1);
    r('#000',2,5,2,3);r('#c0392b',2,9,3,1);
    shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#f2c28b',1-a*.5,14,4,5);watchPos=[1-a*.5,16]}
    tiePos=[1,12];topY=-4;
  }else if(sk=='ojol'){
    o('#14833b',-11,12,5,10);r('#fff',-10,14,3,3);
    o('#2c3e66',-5+a,21,4,8);o('#2c3e66',1-a,21,4,8);
    o('#1db954',-7,11,14,10);r('#1e242b',-7,11,5,10);r('#111',1,11,1,10);r('#dfe6e9',-5,15,10,1);
    o('#f2c28b',-6,1,12,10);
    o('#1db954',-7,-4,14,7);r('#111',-7,-1,14,2);
    r('#74b9ff',1,2,6,4);r('#dff9fb',2,2,3,1);
    r('#000',2,6,2,2);r('#c0392b',2,9,3,1);
    shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#1e242b',1-a*.5,14,4,4);r('#f2c28b',1-a*.5,18,4,2);watchPos=[1-a*.5,17]}
    tiePos=[1,12];topY=-4;
  }else if(sk=='dokter'){
    o('#e63946',-11,13,5,9);r('#fff',-9,15,1,5);r('#fff',-10,17,3,1);
    o('#2c3e50',-5+a,21,4,8);o('#2c3e50',1-a,21,4,8);
    o('#ffffff',-7,11,14,11);r('#48dbfb',-1,11,4,6);
    r('#576574',-3,11,1,5);r('#576574',3,11,1,5);r('#bdc3c7',3,16,2,2);
    o('#f2c28b',-6,0,12,11);r('#222',-7,-2,14,4);r('#222',-8,2,3,6);
    r('#000',2,5,2,3);r('#c0392b',2,9,3,1);
    shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#f2c28b',1-a*.5,14,4,5);watchPos=[1-a*.5,16]}
    tiePos=[1,12];topY=-3;
  }else if(sk=='tni'){
    o('#3b5323',-11,12,5,10);r('#222',-11,15,5,2);
    o('#4b6b3c',-5+a,21,4,8);o('#4b6b3c',1-a,21,4,8);r('#2d4223',-5+a,23,3,2);r('#6b5335',2-a,22,2,3);
    o('#4b6b3c',-7,11,14,10);r('#2d4223',-6,12,4,4);r('#6b5335',1,13,4,3);r('#1e2718',-2,16,3,3);
    r('#1b1b1b',-7,19,14,2);r('#ffd93b',1,19,3,2);
    o('#f2c28b',-6,0,12,11);r('#222',-7,2,2,4);
    o('#2e7d32',-8,-4,15,5);r('#1b5e20',-8,-4,4,5);r('#ffd93b',3,-3,2,2);
    r('#000',2,5,2,3);r('#c0392b',2,9,3,1);
    shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#2d4223',1-a*.5,14,4,4);r('#f2c28b',1-a*.5,18,4,2);watchPos=[1-a*.5,17]}
    tiePos=[1,12];topY=-4;
  }else if(sk=='ultramen'){
    o('#dfe6e9',-5+a,21,4,8);o('#dfe6e9',1-a,21,4,8);r('#e84118',-5+a,24,4,3);r('#e84118',1-a,24,4,3);
    o('#dfe6e9',-7,11,14,10);r('#e84118',-7,11,4,5);r('#e84118',3,11,4,5);r('#e84118',-5,17,10,3);
    r('#00d2d3',1,14,3,3);r('#fff',2,15,1,1);
    o('#dfe6e9',-6,0,12,11);r('#b2bec3',-7,3,2,5);
    o('#dfe6e9',-2,-5,5,5);r('#fff',-1,-4,3,4);
    r('#1b1b1b',1,4,5,4);r('#fff200',2,5,3,2);
    r('#636e72',1,9,3,1);
    r('#e84118',-6+a,27,7,3);r('#b33939',-6+a,30,7,1);r('#e84118',0-a,27,7,3);r('#b33939',0-a,30,7,1);
    if(hasShoe){shoe(-6+a,27);shoe(0-a,27)}
    if(hasWatch){o('#dfe6e9',1-a*.5,14,4,5);watchPos=[1-a*.5,16]}
    tiePos=[1,12];topY=-5;
  }else{
    // skin SMA (default / fallback)
    o('#3a5a9a',-11,12,5,10);o('#8a8f98',-5+a,21,4,8);o('#8a8f98',1-a,21,4,8);o('#fff',-7,11,14,10);r('#555',-7,19,14,2);r('#5b6b8c',-1,12,3,7);
    o('#f2c28b',-6,0,12,11);r('#222',-7,-2,14,5);r('#222',-8,2,4,8);
    r('#000',2,5,2,3);r('#c0392b',2,9,3,1);shoe(-6+a,27);shoe(0-a,27);
    if(hasWatch){o('#f2c28b',1-a*.5,14,4,5);watchPos=[1-a*.5,16]}
    tiePos=[1,12];topY=-3;
  }

  if(hasTie)drawTie(c,tiePos[0],tiePos[1]);
  if(hasWatch)drawWatch(c,Math.round(watchPos[0]),Math.round(watchPos[1]));
  if(hasHat){drawHat(c,0,topY);topY-=7;}
  if(hasBurger)drawBurger(c,0,topY);
}

// ===== PREVIEW IKON ITEM (44x44) =====
function prev(id){try{const cv=document.createElement('canvas');cv.width=44;cv.height=44;const c=cv.getContext('2d');
  if(id=='sepatu'){
    c.fillStyle='#0b2a66';c.fillRect(4,29,36,5);
    c.fillStyle='#1e6fff';c.fillRect(6,12,16,18);c.fillRect(6,22,32,8);
    c.fillStyle='#fff';c.fillRect(11,15,7,2);c.fillRect(11,19,7,2);
  }else if(id=='burger'){
    c.fillStyle='#1b1b1b';c.fillRect(6,31,32,6);c.fillStyle='#d9822b';c.fillRect(8,32,28,4);
    c.fillStyle='#1b1b1b';c.fillRect(4,26,36,6);c.fillStyle='#5c2c16';c.fillRect(6,27,32,4);
    c.fillStyle='#ffd93b';c.fillRect(6,25,32,2);c.fillRect(11,27,4,4);c.fillRect(27,27,4,3);
    c.fillStyle='#4cd137';c.fillRect(5,22,34,3);
    c.fillStyle='#e84118';c.fillRect(8,19,28,3);
    c.fillStyle='#1b1b1b';c.fillRect(6,12,32,8);c.fillRect(10,9,24,4);
    c.fillStyle='#f39c12';c.fillRect(8,13,28,6);c.fillRect(12,10,20,4);
    c.fillStyle='#fff6d6';c.fillRect(14,13,3,2);c.fillRect(22,11,3,2);c.fillRect(28,14,3,2);
  }else if(id=='jam'){
    c.fillStyle='#1b1b1b';c.fillRect(16,3,12,38);
    c.fillStyle='#2f3640';c.fillRect(18,5,8,34);
    c.fillStyle='#7f8fa6';c.fillRect(19,8,6,2);c.fillRect(19,34,6,2);
    c.fillStyle='#1b1b1b';c.fillRect(11,12,22,20);
    c.fillStyle='#ffd93b';c.fillRect(13,14,18,16);
    c.fillStyle='#0c2461';c.fillRect(15,16,14,12);
    c.fillStyle='#fff';c.fillRect(21,18,2,5);c.fillRect(21,22,5,2);
    c.fillStyle='#ff5252';c.fillRect(21,21,2,2);
  }else if(id=='sayap'){
    c.fillStyle='#1b1b1b';
    c.fillRect(3,10,16,8);c.fillRect(2,17,17,7);c.fillRect(5,24,14,6);c.fillRect(9,30,10,4);
    c.fillRect(25,10,16,8);c.fillRect(25,17,17,7);c.fillRect(25,24,14,6);c.fillRect(25,30,10,4);
    c.fillStyle='#74b9ff';
    c.fillRect(5,12,13,5);c.fillRect(4,18,14,5);c.fillRect(7,24,11,5);
    c.fillRect(26,12,13,5);c.fillRect(26,18,14,5);c.fillRect(26,24,11,5);
    c.fillStyle='#ffffff';
    c.fillRect(6,12,11,3);c.fillRect(5,18,12,3);c.fillRect(8,24,9,3);c.fillRect(11,30,7,2);
    c.fillRect(27,12,11,3);c.fillRect(27,18,12,3);c.fillRect(27,24,9,3);c.fillRect(26,30,7,2);
  }else if(id=='topi'){
    c.fillStyle='#1b1b1b';c.fillRect(4,28,36,7);c.fillRect(10,11,24,19);
    c.fillStyle='#2980b9';c.fillRect(6,30,32,3);c.fillRect(12,13,20,16);
    c.fillStyle='#54a0ff';c.fillRect(14,15,6,8);
    c.fillStyle='#ffd93b';c.fillRect(12,24,20,4);
  }else if(id=='dasi'){
    c.fillStyle='#1b1b1b';c.fillRect(16,6,12,9);c.fillRect(17,14,10,16);c.fillRect(19,30,6,4);c.fillRect(21,34,2,3);
    c.fillStyle='#e63946';c.fillRect(18,8,8,5);c.fillRect(19,14,6,15);c.fillRect(20,29,4,4);
    c.fillStyle='#ff7675';c.fillRect(20,9,3,3);c.fillRect(20,16,2,10);
  }else{
    // karakter: preview otomatis dari chr()
    c.translate(22,10);c.scale(1.05,1.05);chr(c,id,[],0);
  }
  return cv.toDataURL()}catch(e){return''}}

// ===== TAMPILAN TOKO =====
// Kategori tab (urutan tab dari kiri ke kanan)
const CATS=['Karakter','Aksesoris','Senjata'];

// Gambar karakter (skin + daftar aksesoris) untuk panel kanan
function charImg(skin,acc){try{
  const cv=document.createElement('canvas');cv.width=52;cv.height=64;
  const c=cv.getContext('2d');c.translate(30,32);
  chr(c,skin||S.skin,acc||S.acc,0);
  return cv.toDataURL()}catch(e){return''}}

// Gembok pixel (SVG). Bagian .sh-shk (lengkungan) dianimasikan saat terbuka.
const LOCK='<svg viewBox="0 0 16 19"><g class=sh-shk><path d="M4.5 10V3.5H11.5V10" fill="none" stroke="#1b1b1b" stroke-width="4"/><path d="M4.5 10V3.5H11.5V10" fill="none" stroke="#cfd8dc" stroke-width="2"/></g><rect x="1.5" y="9" width="13" height="9.5" fill="#1b1b1b"/><rect x="2.5" y="10" width="11" height="7.5" fill="#ffd93b"/><rect x="2.5" y="15.5" width="11" height="2" fill="#f0a800"/><rect x="7" y="12" width="2" height="3" fill="#1b1b1b"/></svg>';

// Skala toko mengikuti ukuran canvas game (800 x 450).
// Semua ukuran di CSS di bawah ditulis dalam "unit game": z(14) = 14 unit.
// Jadi toko otomatis mengecil/membesar bersama layar game dan tidak keluar batas.
const shopU=()=>Math.max(.2,(C.getBoundingClientRect().width||W)/W);

// CSS khusus toko (ubah ukuran/warna di sini)
function shopStyle(){
  if(document.getElementById('shop-css'))return;
  const z=n=>`calc(var(--u,.5px)*${n})`;
  const s=document.createElement('style');s.id='shop-css';
  s.textContent=`
#ui .sh-root{position:absolute;left:0;top:0;width:100%;height:100%;box-sizing:border-box;padding:${z(8)};display:flex;flex-direction:column;gap:${z(6)};text-align:left}
#ui .sh-top{display:flex;align-items:center;gap:${z(10)};flex:none;height:${z(30)}}
#ui .sh-top h2{margin:0;padding:0;flex:1;font-size:${z(24)};line-height:1}
#ui .sh-coin{color:#ffd93b;font-weight:bold;font-size:${z(17)}}
#ui .sh-top button{margin:0;padding:0 ${z(14)};height:${z(30)};min-height:0;width:auto;font-size:${z(15)};line-height:1;letter-spacing:0}
#ui .sh-wrap{flex:1;min-height:0;display:flex;gap:${z(10)}}
#ui .sh-left{flex:1;min-width:0;display:flex;flex-direction:column;gap:${z(6)}}
#ui .sh-tabs{display:flex;gap:${z(4)};flex:none}
#ui .sh-tab{flex:1;min-width:0;margin:0;padding:0;height:${z(30)};min-height:0;width:auto;font-size:${z(15)};line-height:1;letter-spacing:0;opacity:.6}
#ui .sh-tab.on{opacity:1;outline:${z(2)} solid #ffd93b}
#ui .sh-list{flex:1;min-height:0;display:flex;flex-direction:column;gap:${z(6)};overflow-y:auto;padding:${z(3)} ${z(4)} ${z(3)} ${z(3)}}
#ui .sh-it{flex:none;display:flex;align-items:center;gap:${z(8)};margin:0;padding:${z(4)} ${z(8)};width:100%;height:${z(52)};min-height:0;box-sizing:border-box;text-align:left;letter-spacing:0;overflow:hidden}
#ui .sh-ic{position:relative;flex:none;width:${z(40)};height:${z(40)}}
#ui .sh-ic img{width:100%;height:100%;image-rendering:pixelated;display:block}
#ui .sh-it.lkd .sh-ic img{filter:brightness(.55)}
#ui .sh-it .sh-n{flex:1;min-width:0;font-size:${z(16)};font-weight:bold;line-height:1.1}
#ui .sh-it .sh-s{flex:none;font-size:${z(13)};white-space:nowrap}
#ui .sh-it.on{box-shadow:inset 0 0 0 ${z(2)} #2ecc40}
#ui .sh-it.sel{outline:${z(2)} solid #ffd93b}
#ui .sh-empty{padding:${z(40)} ${z(10)};text-align:center;opacity:.7;font-size:${z(15)}}
#ui .sh-right{width:${z(190)};flex:none;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${z(4)};background:rgba(0,0,0,.35);border-radius:${z(10)};padding:${z(8)};text-align:center}
#ui .sh-stage{position:relative;flex:none;width:${z(156)};height:${z(172)}}
#ui .sh-char{position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;object-fit:contain}
#ui .sh-char.lk{filter:brightness(.25) grayscale(1)}
#ui .sh-char.unl{animation:shReveal 1.2s forwards}
#ui .sh-right b{font-size:${z(16)}}
#ui .sh-right small{font-size:${z(12)};line-height:1.35;opacity:.85}
#ui .sh-st{font-weight:bold;opacity:1!important}
#ui .sh-st.lk{color:#ff8a8a}
#ui .sh-st.ok{color:#7dff9a}
#ui .sh-act{margin:${z(2)} 0 0;padding:0 ${z(8)};width:100%;height:${z(30)};min-height:0;font-size:${z(14)};line-height:1;letter-spacing:0}
/* gembok */
#ui .sh-lk{position:absolute;pointer-events:none}
#ui .sh-lk svg{display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(0 ${z(2)} 0 rgba(0,0,0,.45))}
#ui .sh-lk.big{left:50%;top:50%;width:${z(64)};margin:${z(-38)} 0 0 ${z(-32)}}
#ui .sh-lk.badge{right:${z(2)};top:${z(2)};width:${z(34)}}
#ui .sh-lk.sm{right:${z(-3)};bottom:${z(-3)};width:${z(17)}}
#ui .sh-lk.open svg{animation:shLk 1.2s ease-in forwards}
#ui .sh-lk.open .sh-shk{transform-box:fill-box;transform-origin:0 100%;animation:shShk 1.2s ease-out forwards}
#ui .sh-sp{position:absolute;left:50%;top:50%;width:${z(7)};height:${z(7)};margin:${z(-4)} 0 0 ${z(-4)};background:#ffd93b;box-shadow:0 0 0 ${z(1)} #1b1b1b;opacity:0;pointer-events:none;animation:shSp .8s .55s ease-out forwards}
@keyframes shLk{
 0%{transform:none;opacity:1}
 8%{transform:rotate(-9deg)}16%{transform:rotate(9deg)}24%{transform:rotate(-6deg)}32%{transform:rotate(0)}
 70%{transform:scale(1.12);opacity:1}
 100%{transform:translateY(40%) scale(.7);opacity:0}}
@keyframes shShk{
 0%,30%{transform:none}
 50%{transform:translateY(-3px)}
 70%,100%{transform:translateY(-3px) rotate(-38deg)}}
@keyframes shReveal{
 0%,45%{filter:brightness(.25) grayscale(1)}
 100%{filter:none}}
@keyframes shSp{
 0%{opacity:1;transform:translate(0,0) scale(1)}
 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
`;
  document.head.appendChild(s);
  addEventListener('resize',()=>{const r=document.querySelector('.sh-root');if(r)r.style.setProperty('--u',shopU()+'px')});
}

// Kartu item di daftar kiri (tap = preview, bukan beli)
function shopCard(it,sel){
  const own=S.owned.includes(it.id),on=eq(it),isSel=!!sel&&sel.id==it.id;
  const lbl=on?'✓ Dipakai':own?'Dimiliki':'● '+it.p;
  return`<button class="sh-it${on?' on':''}${isSel?' sel':''}${own?'':' lkd'}" data-a=buy data-n="sel:${it.id}"><span class=sh-ic><img src="${prev(it.id)}">${own?'':`<span class="sh-lk sm">${LOCK}</span>`}</span><span class="sh-n">${it.n}</span><span class="sh-s">${lbl}</span></button>`;
}

// Dipasang ke objek A di game.js (A.shop dan A.buy)
const SHOP={
  cur:'Karakter', // tab yang sedang dibuka
  sel:null,       // id item yang sedang di-preview
  unl:null,       // {id,t} animasi gembok terbuka yang sedang berjalan
  shop(reset){
    st='menu';shopStyle();
    const tab=SHOP.cur;
    let sel=IT.find(x=>x.id==SHOP.sel)||null;if(sel&&sel.cat!=tab)sel=null;
    const old=document.querySelector('#ui .sh-list'),sc=(!reset&&old)?old.scrollTop:0;
    const items=IT.filter(x=>x.cat==tab);
    const tabs=CATS.map(c=>`<button class="sh-tab${c==tab?' on':''}" data-a=buy data-n="tab:${c}">${c}</button>`).join('');
    const list=items.length?items.map(it=>shopCard(it,sel)).join(''):'<div class=sh-empty>Belum ada item.<br>Segera hadir!</div>';

    // --- panel kanan: preview item terpilih ---
    const own=sel?S.owned.includes(sel.id):true,locked=!!sel&&!own;
    const anim=!!sel&&!!SHOP.unl&&SHOP.unl.id==sel.id&&performance.now()-SHOP.unl.t<1500;
    const isChar=!!sel&&sel.cat=='Karakter';
    const skin=isChar?sel.id:S.skin;
    const acc=(sel&&sel.cat=='Aksesoris'&&!S.acc.includes(sel.id))?[...S.acc,sel.id]:S.acc;
    const shown=sel||IT.find(x=>x.id==S.skin);
    const wp=IT.find(x=>x.id==S.weapon);
    const accOn=IT.filter(x=>x.cat=='Aksesoris'&&acc.includes(x.id)).map(x=>x.n);
    const imgCls=locked&&isChar?'lk':anim&&isChar?'unl':'';
    const lockEl=(locked||anim)?`<span class="sh-lk ${isChar?'big':'badge'}${anim?' open':''}">${LOCK}</span>`:'';
    const spk=anim?[[-1,-1],[0,-1.3],[1,-1],[1.3,0],[1,1],[0,1.3],[-1,1],[-1.3,0]].map(([x,y])=>`<i class=sh-sp style="--dx:calc(var(--u,.5px)*${Math.round(x*48)});--dy:calc(var(--u,.5px)*${Math.round(y*48)})"></i>`).join(''):'';
    let stat='',act='';
    if(sel){
      const on=eq(sel);
      if(locked){
        stat='<small class="sh-st lk">🔒 Terkunci</small>';
        act=`<button class="g sh-act" data-a=buy data-n="${sel.id}" ${S.coins>=sel.p?'':'disabled'}>${S.coins>=sel.p?'Beli ● '+sel.p:'Koin kurang (● '+sel.p+')'}</button>`;
      }else{
        stat=`<small class="sh-st ok">${anim?'🔓 Terbuka!':on?'✓ Sedang dipakai':'Dimiliki'}</small>`;
        if(sel.cat=='Karakter')act=`<button class="sh-act" data-a=buy data-n="${sel.id}" ${on?'disabled':''}>${on?'✓ Dipakai':'Pakai'}</button>`;
        else act=`<button class="${on?'r':'g'} sh-act" data-a=buy data-n="${sel.id}">${on?'Lepas':'Pakai'}</button>`;
      }
    }
    ui(`<div class=sh-root style="--u:${shopU()}px">
<div class=sh-top><h2>TOKO</h2><span class=sh-coin>● ${S.coins}</span><button data-a=menu>Kembali</button></div>
<div class=sh-wrap>
<div class=sh-left><div class=sh-tabs>${tabs}</div><div class=sh-list>${list}</div></div>
<div class=sh-right><div class=sh-stage><img class="sh-char ${imgCls}" src="${charImg(skin,acc)}">${lockEl}${spk}</div><b>${shown?shown.n:''}</b>${stat}
<small>Aksesoris: ${accOn.length?accOn.join(', '):'-'}<br>Senjata: ${wp?wp.n:'-'}</small>${act}</div>
</div></div>`);
    const nl=document.querySelector('#ui .sh-list');if(nl&&sc)nl.scrollTop=sc;
  },
  buy(id){
    id=String(id);
    // pindah tab (data-n="tab:NamaKategori")
    if(id.startsWith('tab:')){SHOP.cur=id.slice(4);SHOP.sel=null;SHOP.unl=null;sfx(600,.06);SHOP.shop(1);return}
    // preview item (data-n="sel:ID") — TIDAK membeli
    if(id.startsWith('sel:')){SHOP.sel=id.slice(4);SHOP.unl=null;sfx(600,.06);SHOP.shop();return}
    // beli / pakai / lepas (data-n="ID") — dari tombol di panel kanan
    const it=IT.find(x=>x.id==id);if(!it)return;
    const had=S.owned.includes(id);
    if(!had){
      if(S.coins<it.p){sfx(150,.2,'sawtooth');return}
      S.coins-=it.p;S.owned.push(id);sfx(900,.2);
      setTimeout(()=>sfx(1250,.18),420);            // bunyi "klik" gembok terbuka
      SHOP.unl={id,t:performance.now()};            // mulai animasi gembok terbuka
    }else sfx(600,.08);
    if(it.cat=='Karakter')S.skin=id;
    else if(it.cat=='Senjata')S.weapon=(had&&S.weapon==id)?'':id;
    else{
      const idx=S.acc.indexOf(id);
      if(idx>=0&&had)S.acc.splice(idx,1);
      else if(idx<0)S.acc.push(id);
    }
    SHOP.sel=id;
    save();SHOP.shop();
  }
};
