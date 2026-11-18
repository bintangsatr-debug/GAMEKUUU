'use strict';
/* ============================================================
   SHOP.JS — semua yang berhubungan dengan TOKO:
   1) IT            : daftar item (id, nama, kategori, harga)
   2) chr() + draw* : gambar karakter & aksesoris di game
   3) prev()        : ikon preview item di kartu toko
   4) shopCard()    : tampilan kartu item di toko
   5) SHOP.shop()   : tampilan halaman toko
   6) SHOP.buy()    : logika beli / pakai / lepas

   Dimuat SEBELUM game.js. Memakai dari game.js (dipanggil saat
   runtime): S, ui, save, sfx, st, A
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
const eq=it=>it.cat=='Karakter'?S.skin==it.id:S.acc.includes(it.id);

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
function shopCard(it){
  const own=S.owned.includes(it.id),on=eq(it);
  const lbl=on?(it.cat=='Aksesoris'?'✓ Dipakai (Lepas)':'✓ Dipakai'):own?'Pakai':'● '+it.p;
  return`<button class="it${on?' on':''}" data-a=buy data-n=${it.id} ${own||S.coins>=it.p?'':'disabled'}><img src="${prev(it.id)}"><b>${it.n}</b><span>${lbl}</span></button>`;
}

// Dipasang ke objek A di game.js (A.shop dan A.buy)
const SHOP={
  shop(){
    st='menu';
    const chars=IT.filter(x=>x.cat=='Karakter').map(shopCard).join('');
    const accs=IT.filter(x=>x.cat=='Aksesoris').map(shopCard).join('');
    ui(`<h2>TOKO • ● ${S.coins} Koin</h2>
<div class=shop-sec><div class=shop-cat>Kategori: Karakter</div><div class=row>${chars}</div></div>
<div class=shop-sec><div class=shop-cat>Kategori: Aksesoris (Bisa Dipakai Bersamaan)</div><div class="row acc-row">${accs}</div></div>
<button data-a=menu>Kembali</button>`);
  },
  buy(id){
    const it=IT.find(x=>x.id==id);if(!it)return;
    const had=S.owned.includes(id);
    if(!had){
      if(S.coins<it.p){sfx(150,.2,'sawtooth');return}
      S.coins-=it.p;S.owned.push(id);sfx(900,.2);
    }else sfx(600,.08);
    if(it.cat=='Karakter')S.skin=id;
    else{
      const idx=S.acc.indexOf(id);
      if(idx>=0&&had)S.acc.splice(idx,1);
      else if(idx<0)S.acc.push(id);
    }
    save();A.shop();
  }
};
