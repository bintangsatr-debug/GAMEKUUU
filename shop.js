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