'use strict';
/* ============================================================
   CUTSCENE.JS — semua cutscene level (1–5 + adegan Taman Sekolah)
   Dimuat SEBELUM game.js. Memakai variabel global dari game.js:
   X, W, H, S, at, st, tr, T, chr, sfx, tx, bat, trans, ui, bgmSync
   Dipakai oleh game.js: CS, cut(), drawCut(), cutNext(), cutEnd()
   ============================================================ */

// ===== CUTSCENE =====
const NM={pensil:'PENSIL',sma:'SISWA SMA',sd:'SISWA SD',kopdes:'PETUGAS KOPDES',ojol:'OJEK ONLINE',buku:'BUKU TULIS',dokter:'DOKTER',tni:'TNI',ultramen:'ULTRAMEN'};
const CS={1:{
  pre:[{b:'ramai',t:'ahh tai bosen banget njir, ngapain nyak'},
       {b:'sepi',t:'bujuk, napa nih?'},
       {b:'guru',t:'SIALLL GW HARUS KABUR!!!',d:1.3,m:2.2}],
  post:[{b:'hutan',t:'fiuhh, untung aja bisa kabur gweh',d:1.8},
        {b:'portal',t:'WOYYY!!!!',d:1.3,m:2.4}]},
2:{pre:[{b:'jatuh',t:'',m:2.4},
        {b:'rimba',p:0,t:'FUCKK',d:.5},
        {b:'rimba',p:1,t:'DIMANA GW INI??!',d:.3},
        {b:'rimba',p:2,t:'MAU KABUR AJA KESERIMPET JIN',d:.3}],
  post:[{b:'gunung',p:0,t:'deymm, udah kaya cerita bapak gw dulu kalo mau ke sekolah',d:1.9},
        {b:'gunung',p:1,t:'hadeuhh..',d:.4}]},
3:{pre:[{b:'daki',t:'etdah, ampe naik gunung gini',d:.4}],
  post:[{b:'sandung',t:'ADUHH!!!',d:.55,m:2.0},
        {b:'lubang',t:'SIALAN!!! SIAL BAT DAH',d:.9,m:2.1},
        {b:'malam',p:0,t:'duh gimana keluarnya ini',d:.5,m:1.8},
        {b:'malam',p:1,t:'coba naik deh',d:.3,m:1.8}]},
4:{pre:[{b:'temu4',p:0,t:'BUSETTT AFAAN TUH',d:.85,m:2.1},
        {b:'temu4',p:1,t:'loh ngilang njay',d:.55,m:1.9}],
  post:[{b:'dimensi',p:0,t:'APA LAGI INIII!!!!!',d:1.05,m:2.3},
        {b:'dimensi',p:1,t:'AWAS AJA LU, JIN PARTAI',d:.4,m:2.1}]},
5:{pre:[{b:'kastil5',p:0,t:'geloo ini teh apaan',d:.95,m:2.2},
        {b:'kastil5',p:1,t:'NERAKA KAH???',d:.35,m:1.9}],
  post:[{b:'kalah5',t:'AHAHAHA MAMPUSSS',d:.45,m:2.2},
        {b:'taman6',p:0,t:'pergi ah',d:.3,m:1.8},
        {b:'taman6',p:1,t:'BJIRRR BISA GITU NGAB',d:.95,m:2.2},
        {b:'taman6',p:2,t:'oke lanjut...',d:.35,m:1.9}]}};
let cs=null;
const rc=(k,x,y,w,h)=>{X.fillStyle=k;X.fillRect(x,y,w,h)};
function cut(sc,cb){cs={sc,i:0,t0:at,full:0,fin:0,cb};st='cut';ui('');bgmSync()}
const cutN=(s,ts)=>cs.full?s.t.length:Math.max(0,Math.min(s.t.length,Math.floor((ts-(s.d||0))*32)));
function cutNext(){
  if(!cs||cs.fin||tr)return;const s=cs.sc[cs.i],ts=at-cs.t0;
  if(cutN(s,ts)<s.t.length){if(ts>.2)cs.full=1;return}
  if(ts<(s.m||0))return;sfx(440,.05);
  if(cs.i+1>=cs.sc.length)cutEnd();else{cs.i++;cs.t0=at;cs.full=0}
}
function cutEnd(){if(!cs||cs.fin||tr)return;cs.fin=1;trans(cs.cb)}
function hero(x,y,sc,wk,face,rot){X.save();X.translate(Math.round(x),Math.round(y));if(rot)X.rotate(rot);X.scale(face*sc,sc);X.translate(0,-31);chr(X,S.skin,S.acc,wk);X.restore()}
const SHc=['#4aa3ff','#ff8a3d','#9b59b6','#2ecc71','#e84393'],HRc=['#222','#6b3e1a','#d4a017','#111','#8a2be2'];
function kid(x,y,s,sh,hr,f,go){
  const b=go?Math.round(Math.sin(at*(7+f%3)+f*2)*2):0;X.save();X.translate(Math.round(x),Math.round(y+b));X.scale(s,s);
  rc(sh,-6,-14,12,14);rc('#000',-6,-27,12,14);rc('#f2c28b',-5,-26,10,12);rc(hr,-6,-29,12,5);rc('#000',-3,-22,2,3);rc('#000',2,-22,2,3);
  rc('#c0392b',-1,-17,3,go?2+((at*8+f)|0)%2:1);X.restore()}
function desk(x,y,w,h){rc('#000',x-w/2-2,y-2,w+4,h+2);rc('#e0a860',x-w/2,y,w,8);rc('#a8743a',x-w/2+3,y+8,w-6,h-8)}
function bub(x,y,t){X.font='bold 14px monospace';const w=t.length*9+10;rc('#000',x-1,y-1,w+2,22);rc('#fff',x,y,w,20);rc('#fff',x+6,y+20,6,5);X.fillStyle='#000';X.textAlign='left';X.fillText(t,x+5,y+15)}
function guru(x,y,s){
  X.save();X.translate(Math.round(x),Math.round(y));X.scale(s,s);
  rc('#2b1d12',-7,-13,6,10);rc('#2b1d12',1,-13,6,10);rc('#000',-8,-4,8,4);rc('#000',0,-4,8,4);
  rc('#8b5a2b',-10,-31,20,19);rc('#6e4520',0,-31,1,19);rc('#fff',-3,-31,6,3);
  rc('#8b5a2b',-14,-30,5,14);rc('#f2c28b',-14,-17,5,4);rc('#8b5a2b',9,-30,5,12);rc('#f2c28b',9,-19,5,4);
  rc('#ffd93b',11,-40,2,24);rc('#2a6fdb',-22,-24,9,12);rc('#fff',-21,-23,7,2);
  rc('#000',-8,-44,16,14);rc('#f2c28b',-7,-43,14,13);rc('#111',-8,-47,16,5);rc('#111',-8,-44,2,7);rc('#111',6,-44,2,7);
  rc('#000',-6,-39,5,4);rc('#000',1,-39,5,4);rc('#bfe9ff',-5,-38,3,2);rc('#bfe9ff',2,-38,3,2);rc('#000',-1,-38,2,1);
  rc('#111',-6,-41,5,1);rc('#111',1,-41,5,1);rc('#111',-4,-34,8,2);rc('#8a2d2d',-2,-32,4,1);X.restore()}

function cls(m,ts){
  rc('#eadfc2',0,0,W,252);rc('#cdb68a',0,196,W,56);rc('#a8895a',0,196,W,4);
  rc('#b07d46',0,252,W,80);for(let i=0;i<W;i+=80)rc('#8f6234',i,252,3,80);rc('#8f6234',0,292,W,3);rc('#6e4a22',0,252,W,4);
  rc('#000',26,26,128,98);rc('#8fd3ff',30,30,120,90);rc('#fff',88,30,4,90);rc('#fff',30,72,120,4);rc('#fff',34+(at*5)%50,44,26,8);
  rc('#000',226,22,352,104);rc('#8b5a2b',230,26,344,96);rc('#1f4d3a',236,32,332,84);
  X.font='bold 30px monospace';X.textAlign='center';X.fillStyle=m==2?'#ff9a9a':'#fff';X.fillText(m==2?'ULANGAN MAT!':'12×12 = ?',402,86);rc('#fff',250,102,60,3);rc('#e8e8e8',500,106,24,6);
  X.fillStyle='#000';X.beginPath();X.arc(640,56,25,0,7);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(640,56,21,0,7);X.fill();
  const a=Math.floor(at)*Math.PI/30;X.strokeStyle='#000';X.lineWidth=3;X.beginPath();X.moveTo(640,56);X.lineTo(640,42);X.moveTo(640,56);X.lineTo(648,60);X.stroke();
  X.strokeStyle='#d62839';X.lineWidth=2;X.beginPath();X.moveTo(640,56);X.lineTo(640+Math.sin(a)*18,56-Math.cos(a)*18);X.stroke();
  const open=m==2;rc('#000',684,40,110,214);rc(open?'#15101f':'#8b5a2b',690,46,98,208);
  if(open)rc('#3a2a1a',690,46,10,208);else{rc('#5d3a1a',700,58,78,70);rc('#ffd93b',698,160,7,10)}
  const go=m==0,B=[280,380,480,580],F=[340,480];
  B.forEach((x,i)=>{kid(x,236,2,SHc[i],HRc[i],i,go);desk(x,218,60,26)});
  F.forEach((x,i)=>{kid(x,318,3,SHc[i+2],HRc[i+2],i+4,go);desk(x,285,90,47)});
  if(go){const T=['bla bla','HAHA','woy!','psst..','wkwk'];
    B.concat(F).forEach((x,i)=>{if((at*.8+i*.9)%3<1.3)bub(x-6,i<4?150:196,T[i%5])});
    const px=((at*150)%950)-60;rc('#000',px-1,139,10,10);rc('#fff',px,140,8,8)}
  const fc=m==1?(((at*1.3)|0)%2?1:-1):1,sw=m==0?Math.sin(at*2)*.04:0,sh=m==2?Math.sin(at*70)*3:0;
  hero(200+sh,318,4,0,fc,sw);desk(200,285,104,47);
  if(m==0)bub(238,168,'...');else if(m==1)bub(238,168,'?');else tx('!!',250,178,44,'#ff3b3b');
  if(m==1){rc('rgba(0,0,50,.2)',0,0,W,332);if(((at*2)|0)%2)rc('#4fc3f7',392,196,3,6)}
  if(m==2){
    const u=Math.min(1,ts/1.6),e=es(u),bob=u<1?Math.abs(Math.sin(at*10))*3:0;
    guru(745+(640-745)*e,262+(318-262)*e-bob,3+1.2*e);
    rc(`rgba(255,0,0,${.07+.05*Math.sin(at*8)})`,0,0,W,332)}
}
function out(){
  const g=X.createLinearGradient(0,0,0,332);g.addColorStop(0,'#5ec8ff');g.addColorStop(1,'#d6f3ff');X.fillStyle=g;X.fillRect(0,0,W,332);
  X.fillStyle='#ffe066';X.beginPath();X.arc(660,72,32,0,7);X.fill();
  X.fillStyle='#fff';for(let i=0;i<3;i++){const x=((at*9+i*320)%1000)-120,y=44+i*34;X.fillRect(x,y,80,14);X.fillRect(x+14,y-10,44,12)}
  X.fillStyle='#7bd36a';X.beginPath();X.arc(560,262,150,Math.PI,0);X.fill();X.beginPath();X.arc(780,270,110,Math.PI,0);X.fill();
  rc('#58c23a',0,250,W,82);rc('#3f9b3f',0,250,W,8);rc('#47a82f',0,292,W,3);
  for(let i=0;i<14;i++)rc(['#ff6fa5','#ffd93b','#fff'][i%3],360+(i*83)%430,262+(i*29)%60,4,4);
  for(let i=0;i<10;i++){const x=i*30-6,h=190-i*13,y0=250;rc('#4e342e',x+12,y0-40,8,44);X.fillStyle=i%2?'#1f5a35':'#2f7d4f';
    X.beginPath();X.moveTo(x+16,y0-h);X.lineTo(x-14,y0-30);X.lineTo(x+46,y0-30);X.fill();X.beginPath();X.moveTo(x+16,y0-h+50);X.lineTo(x-18,y0-6);X.lineTo(x+50,y0-6);X.fill()}
  const d=X.createLinearGradient(0,0,340,0);d.addColorStop(0,'rgba(8,30,18,.75)');d.addColorStop(1,'rgba(8,30,18,0)');X.fillStyle=d;X.fillRect(0,0,340,332);
  for(let i=0;i<6;i++)rc('#8bd36a',(i*131+at*20)%800,(at*30+i*60)%300,5,3)
}
function sHutan(ts){
  out();const u=Math.min(1,ts/2),walk=u<1;
  hero(60+370*es(u),296,4,walk?Math.sin(at*14):0,1,0);
  if(!walk)rc('#4fc3f7',60+370+24,196+((at*30)%30),3,6)
}
function portal(cx,cy,k){
  if(k<.05)return;const rw=74*k,rh=24*k,cl=['#d66bff','#7a5cff','#4aa8ff','#fff'];
  X.fillStyle='rgba(190,110,255,.35)';X.beginPath();X.ellipse(cx,cy,rw+14,rh+8,0,0,7);X.fill();
  X.fillStyle='#08001a';X.beginPath();X.ellipse(cx,cy,rw,rh,0,0,7);X.fill();
  for(let i=0;i<4;i++){const a=at*(2.5+i)+i*1.7;X.strokeStyle=cl[i];X.lineWidth=3;X.beginPath();X.ellipse(cx,cy,Math.max(1,rw*(.85-i*.2)),Math.max(1,rh*(.85-i*.2)),0,a,a+2.2);X.stroke()}
  X.strokeStyle='#e6b3ff';X.lineWidth=4;X.beginPath();X.ellipse(cx,cy,rw,rh,0,0,7);X.stroke();
  for(let i=0;i<8;i++){const a=at*1.5+i*.8,r=1-((at*.7+i*.13)%1);rc('#fff',Math.round(cx+Math.cos(a)*(rw+26)*r),Math.round(cy+Math.sin(a)*(rh+16)*r-10*r),3,3)}
}
function sPortal(ts){
  out();const cx=560,cy=296;portal(cx,cy,es(Math.min(1,Math.max(0,(ts-.1)/.7))));
  if(ts<1.1)hero(430+130*(ts/1.1),cy,4,Math.sin(at*14),1,0);
  else{const u=Math.min(1,(ts-1.1)/.8);if(u<1){X.save();X.beginPath();X.rect(0,0,W,cy+8);X.clip();hero(cx,cy+u*u*150,4,0,1,u*.5);X.restore()}}
  if(ts>1.7)rc(`rgba(255,255,255,${Math.max(0,.9-(ts-1.7)*1.2)})`,0,0,W,332)
}
function sub(s,ts){
  rc('#000',0,332,W,118);rc('#fff',10,342,W-20,100);rc('#14146b',14,346,W-28,92);
  const T=s.t,n=cutN(s,ts);
  if(n>0){
    tx(NM[S.skin]||'KAMU',28,370,16,'#ffd93b','left');
    X.font='bold 22px monospace';X.textAlign='left';X.fillStyle='#fff';
    const ln=[''];for(const w of T.split(' ')){const c=ln[ln.length-1],nx=c?c+' '+w:w;if(c&&X.measureText(nx).width>730)ln.push(w);else ln[ln.length-1]=nx}
    let k=0;ln.forEach((l,i)=>{X.fillText(l.slice(0,Math.max(0,n-k)),30,402+i*26);k+=l.length+1})}
  if(n>=T.length&&ts>=(s.m||0)&&((at*3)|0)%2)tx('▼',W-34,430,18,'#fff')
}
function rim(){
  const g=X.createLinearGradient(0,0,0,332);g.addColorStop(0,'#1c5a38');g.addColorStop(1,'#a8dc8a');X.fillStyle=g;X.fillRect(0,0,W,332);
  for(let i=0;i<11;i++){const x=i*80-20,h=150+(i*37)%50;rc('#3b2a1a',x+24,190,12,80);X.fillStyle=i%2?'#14522f':'#1d6b3b';
    X.beginPath();X.moveTo(x+30,262-h-40);X.lineTo(x-10,230);X.lineTo(x+70,230);X.fill();X.beginPath();X.moveTo(x+30,262-h+20);X.lineTo(x-16,262);X.lineTo(x+76,262);X.fill()}
  rc('#2f7d32',0,262,W,70);rc('#5cb34a',0,262,W,8);rc('#27692a',0,300,W,3);
  for(let i=0;i<14;i++)rc('#7ed36a',(i*61)%W,274+(i*23)%50,6,3);
  for(let i=0;i<7;i++)rc('#9be37a',(i*131+at*25)%W,(at*35+i*55)%260,5,3)
}
function sJatuh(ts){
  rim();portal(400,14,es(Math.min(1,ts/.5)));
  const u=Math.min(1,Math.max(0,(ts-.3)/1.5));
  if(u<1){for(let i=0;i<8;i++)rc('rgba(255,255,255,.45)',(i*97+30)%W,(at*700+i*83)%332,2,28);
    X.save();X.beginPath();X.rect(0,0,W,332);X.clip();hero(400,-30+326*u*u,4,0,1,ts*5);X.restore()}
  else{hero(400,296,4,0,1,0);const k=ts-1.8;for(let i=0;i<6;i++)rc('#cfe8b0',400+(i-2.5)*22*(1+k*2),290-k*30,8,6);
    if(k<.4)rc(`rgba(255,255,255,${.8-k*2}`+')',0,0,W,332)}
}
function sRimba(ts,p){
  rim();
  if(p==0){hero(400+Math.sin(at*40)*2*(ts<1?1:0),308,4,0,1,-1.45);
    for(let i=0;i<3;i++){const a=at*5+i*2.1;tx('*',350+Math.cos(a)*28,255+Math.sin(a)*8,22,'#ffd93b')}}
  else if(p==1){hero(400,296,4,0,((ts*1.4)|0)%2?1:-1,0);bub(440,150,'??')}
  else{hero(400,296,4,0,1,Math.sin(at*3)*.03);rc('#4fc3f7',428,196+((at*30)%30),3,6);bub(440,150,'...')}
}
function sGunung(ts,p){
  const g=X.createLinearGradient(0,0,0,332);g.addColorStop(0,'#5ec8ff');g.addColorStop(1,'#d6f3ff');X.fillStyle=g;X.fillRect(0,0,W,332);
  X.fillStyle='#fff';for(let i=0;i<2;i++){const x=((at*7+i*400)%1000)-120,y=60+i*50;X.fillRect(x,y,70,12);X.fillRect(x+12,y-9,40,10)}
  const poly=(c,a)=>{X.fillStyle=c;X.beginPath();X.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)X.lineTo(a[i],a[i+1]);X.fill()};
  poly('#8aa0bb',[30,270,220,110,400,270]);poly('#6f86a3',[180,270,500,18,820,270]);
  poly('rgba(40,60,90,.35)',[500,18,820,270,560,270]);
  poly('#fff',[500,18,383,110,425,98,462,122,500,100,540,124,578,98,617,110]);
  poly('#fff',[220,110,170,155,200,148,225,165,250,148,270,155]);
  rc('#4a9a3a',0,262,W,70);rc('#3f8a30',0,262,W,6);
  for(let i=0;i<5;i++){const x=i*48-30;rc('#3b2a1a',x+20,200,12,70);X.fillStyle=i%2?'#0f3d23':'#14522f';
    X.beginPath();X.moveTo(x+26,80+i*14);X.lineTo(x-18,230);X.lineTo(x+70,230);X.fill();X.beginPath();X.moveTo(x+26,150);X.lineTo(x-24,274);X.lineTo(x+76,274);X.fill()}
  const d=X.createLinearGradient(0,0,260,0);d.addColorStop(0,'rgba(5,25,12,.8)');d.addColorStop(1,'rgba(5,25,12,0)');X.fillStyle=d;X.fillRect(0,0,260,332);
  const u=p?1:Math.min(1,ts/1.8),x=Math.round(150+270*es(u)),y=300,walk=u<1;
  hero(x,y,4,walk?Math.sin(at*14):0,1,walk?0:-.12);
  [[-14,-100,'#3f9b3f'],[6,-70,'#6cc24a'],[-12,-40,'#2f7d32'],[-4,-122,'#8bd36a'],[8,-20,'#3f9b3f']].forEach(l=>rc(l[2],x+l[0],y+l[1],9,5));
  if(p&&((at*2)|0)%2)rc('#4fc3f7',x+26,y-110,3,6)
}
function bgSalju(){
  const g=X.createLinearGradient(0,0,0,332);g.addColorStop(0,'#7aa7e0');g.addColorStop(1,'#d8e8ff');X.fillStyle=g;X.fillRect(0,0,W,332);
  X.fillStyle='#fff';for(let i=0;i<3;i++){const x=((at*8+i*310)%980)-110,y=36+i*34;X.fillRect(x,y,74,12);X.fillRect(x+14,y-9,42,10)}
  const poly=(c,a)=>{X.fillStyle=c;X.beginPath();X.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)X.lineTo(a[i],a[i+1]);X.fill()};
  poly('#8d99ae',[40,290,210,120,390,290]);
  poly('#fff',[210,120,165,165,195,158,215,174,238,158,260,165]);
  poly('#77849c',[460,290,650,95,840,290]);
  poly('#fff',[650,95,595,150,630,142,655,162,682,142,710,150]);
  for(let i=0;i<26;i++){const z=i%3?2:3;rc('#fff',(i*73+Math.sin(at+i)*18+at*9)%W,(i*53+at*(28+i%4*8))%332,z,z)}
}
function sDaki(ts){
  bgSalju();
  const slY=x=>310-(x/800)*215;
  const poly=(c,a)=>{X.fillStyle=c;X.beginPath();X.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)X.lineTo(a[i],a[i+1]);X.fill()};
  poly('#5f6368',[0,310,800,95,800,332,0,332]);
  poly('#494d52',[180,332,800,150,800,332]);
  poly('#fff',[0,310,800,95,800,122,0,332]);
  poly('#d8e8ff',[0,324,800,112,800,124,0,332]);
  const u=Math.min(1,ts/2.3),hx=Math.round(130+390*es(u)),hy=Math.round(slY(hx)),walk=u<1?Math.sin(at*13):0;
  hero(hx,hy,4,walk,1,-.22);
  rc('#4fc3f7',hx+24,hy-115+((at*28)%24),3,6);
  rc('rgba(255,255,255,.75)',hx+32+((at*18)%16),hy-88-((at*10)%10),6,4);
}
function sSandung(ts){
  bgSalju();
  const slY=x=>90+(x/800)*220;
  const poly=(c,a)=>{X.fillStyle=c;X.beginPath();X.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)X.lineTo(a[i],a[i+1]);X.fill()};
  poly('#5f6368',[0,90,800,310,800,332,0,332]);
  poly('#494d52',[0,145,650,332,0,332]);
  poly('#fff',[0,90,800,310,800,332,0,116]);
  const rx=230,ry=Math.round(slY(rx));
  poly('#1b1b1b',[rx-16,ry+4,rx-6,ry-15,rx+10,ry-12,rx+18,ry+6]);
  poly('#5f6368',[rx-13,ry+3,rx-5,ry-12,rx+8,ry-9,rx+15,ry+5]);
  poly('#8a8f98',[rx-8,ry-2,rx-4,ry-10,rx+3,ry-7]);
  rc('#fff',rx-5,ry-12,8,3);
  if(ts<.55){
    const hx=Math.round(90+125*(ts/.55)),hy=Math.round(slY(hx));
    hero(hx,hy,4,Math.sin(at*14),1,.2);
  }else{
    const ft=ts-.55,u=Math.min(1,ft/1.3),hx=Math.round(230+410*u);
    const bounce=u<1?Math.abs(Math.sin(u*Math.PI*3.5))*36*(1-u*.35):0;
    const hy=Math.round(slY(hx)-bounce+(u>=1?8:0));
    hero(hx,hy,4,0,1,u<1?ft*13:1.55);
    if(ft<.45)tx('*',rx,ry-26-ft*28,26,'#ffd93b');
    for(let i=0;i<6;i++){const sx=hx-20-i*14,sy=slY(sx)-Math.abs(Math.sin(at*12+i))*18;rc('#fff',sx,sy,7,5)}
  }
}
function sLubang(ts){
  bgSalju();
  const poly=(c,a)=>{X.fillStyle=c;X.beginPath();X.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)X.lineTo(a[i],a[i+1]);X.fill()};
  poly('#5f6368',[0,145,210,262,210,332,0,332]);
  poly('#fff',[0,145,210,262,210,278,0,168]);
  rc('#5f6368',210,262,262,70);rc('#5f6368',588,262,212,70);
  rc('#fff',210,262,266,14);rc('#fff',584,262,216,14);
  rc('#090514',472,262,116,70);
  rc('#2b1a4d',472,262,8,70);rc('#2b1a4d',580,262,8,70);
  X.fillStyle='#000';X.beginPath();X.ellipse(530,264,58,9,0,0,7);X.fill();
  if(ts<.85){
    const u=ts/.85,hx=Math.round(70+460*u),hy=Math.round(hx<210?145+((hx-70)/140)*117:262);
    hero(hx,hy+6,4,0,1,1.45-u*1.45);
    for(let i=0;i<5;i++)rc('#fff',hx-30-i*12,hy-4-(i%3)*5,8,5);
  }else if(ts<1.15){
    hero(530,256,4,Math.sin(at*30),1,0);
    tx('!!',530,126,40,'#ff3b3b');
  }else{
    const fu=Math.min(1,(ts-1.15)/.65);
    X.save();X.beginPath();X.rect(0,0,W,266);X.clip();
    hero(530,Math.round(256+fu*fu*170),4,Math.sin(at*24),1,fu*.35);
    X.restore();
    if(fu<1)for(let i=0;i<4;i++)rc('#fff',486+i*26,262+fu*45+(i%2)*10,6,5);
  }
}
function sMalam(ts,p){
  const nMix=p==1?1:Math.min(1,ts/1.6);
  const g=X.createLinearGradient(0,0,0,205);
  g.addColorStop(0,p==0&&nMix<.5?'#3b1d5e':'#120a26');
  g.addColorStop(1,p==0&&nMix<.5?'#8a3c6b':'#2b1a4d');
  X.fillStyle=g;X.fillRect(0,0,W,205);
  if(nMix<1)rc(`rgba(18,10,38,${nMix*.85})`,0,0,W,205);
  for(let i=0;i<24;i++)rc(`rgba(255,255,255,${nMix*(.35+.55*Math.sin(at*2.5+i)**2)})`,(i*83)%W,(i*37)%175,2,2);
  X.globalAlpha=Math.max(.25,nMix);
  X.fillStyle='#e9e1ff';X.beginPath();X.arc(110,56,22,0,7);X.fill();
  X.fillStyle='#190f33';X.beginPath();X.arc(120,50,20,0,7);X.fill();
  for(let i=0;i<5;i++){
    const ox=(i*170+60)%W,oy=90+(i*31)%85+Math.sin(at+i)*8;
    X.fillStyle='rgba(170,130,255,.28)';X.beginPath();X.arc(ox,oy,10,0,7);X.fill();
    X.fillStyle='#e6dcff';X.beginPath();X.arc(ox,oy,3,0,7);X.fill();
  }
  if(p==1)bat((at*55)%(W+120)-60,68+Math.sin(at*3)*14,1.2,'#07020f');
  X.globalAlpha=1;
  rc('#3b2a66',0,205,345,127);rc('#3b2a66',455,205,345,127);
  rc('#7a52b8',0,205,345,10);rc('#7a52b8',455,205,345,10);
  rc('#53378a',60,235,44,18);rc('#53378a',620,248,52,20);
  rc('#090514',345,205,110,127);
  rc('#241642',345,205,6,127);rc('#241642',449,205,6,127);
  if(p==0){
    hero(400,326,3.2,0,((at*.9)|0)%2?1:-1,Math.sin(at*2)*.04);
    bub(434,212,'...');
  }else{
    const u=Math.min(1,ts/1.35);
    if(u<.72){
      const cu=u/.72;
      hero(428,Math.round(326-cu*121),3.2,Math.sin(at*18),1,-.15);
    }else if(u<1){
      const hu=(u-.72)/.28;
      hero(Math.round(428+hu*66),Math.round(205-Math.sin(hu*Math.PI)*26),3.5,1,1,0);
    }else{
      const look=((at*1.6)|0)%2?1:-1;
      hero(494,205,3.5,0,look,0);
      bub(524,96,'?!');
    }
  }
}
function drawBossEq(cx,by,sc,dir,al,flash){
  if(al<=0)return;
  X.save();X.globalAlpha=Math.max(0,Math.min(1,al));
  X.translate(Math.round(cx),Math.round(by));X.scale(sc,sc);
  rc('#000',-35,-67,70,70);
  rc(flash?'#fff':'#d62839',-32,-64,64,64);
  rc('#ffd93b',-32,-72,10,8);rc('#ffd93b',-16,-72,10,8);rc('#ffd93b',0,-72,10,8);rc('#ffd93b',16,-72,10,8);
  rc('#fff',-20,-50,14,14);rc('#fff',6,-50,14,14);
  rc('#000',-14+dir*3,-44,6,8);rc('#000',12+dir*3,-44,6,8);
  rc('#000',-22,-54,18,4);rc('#000',4,-54,18,4);
  X.fillStyle='#ffd93b';X.font='bold 26px monospace';X.textAlign='center';X.fillText('= ? =',0,-10);
  X.restore();
}
function bgLv4Cut(dawn){
  const g=X.createLinearGradient(0,0,0,262);
  if(dawn>0){
    g.addColorStop(0,'#231942');g.addColorStop(.55,'#6b3e75');g.addColorStop(.85,'#d97b76');g.addColorStop(1,'#f4b37a');
  }else{
    g.addColorStop(0,'#120a26');g.addColorStop(1,'#2b1a4d');
  }
  X.fillStyle=g;X.fillRect(0,0,W,262);
  if(dawn>0){
    X.fillStyle='rgba(255,214,130,.35)';X.beginPath();X.arc(640,256,74,Math.PI,0);X.fill();
    X.fillStyle='rgba(255,235,170,.65)';X.beginPath();X.arc(640,258,42,Math.PI,0);X.fill();
  }
  const starA=dawn>0?.25:1;
  for(let i=0;i<24;i++)rc(`rgba(255,255,255,${starA*(.35+.5*Math.sin(at*2+i)**2)})`,(i*83)%W,(i*37)%185,2,2);
  X.globalAlpha=dawn>0?.45:1;
  X.fillStyle='#e9e1ff';X.beginPath();X.arc(110,64,22,0,7);X.fill();
  X.fillStyle=dawn>0?'#3a2559':'#190f33';X.beginPath();X.arc(121,58,20,0,7);X.fill();
  X.globalAlpha=1;
  for(let i=0;i<7;i++){
    const sx=i*130+24;X.fillStyle='#53378a';
    X.beginPath();X.moveTo(sx,0);X.lineTo(sx+36,0);X.lineTo(sx+18,46+(i%3)*22);X.fill();
  }
  for(let i=0;i<6;i++){
    const ox=(i*145+Math.sin(at*.7+i)*20)%W,oy=105+(i*41)%125+Math.sin(at+i)*10;
    X.fillStyle=`rgba(170,130,255,${(dawn>0?.16:.3)+.15*Math.sin(at*2+i)})`;X.beginPath();X.arc(ox,oy,10,0,7);X.fill();
    X.fillStyle='#e6dcff';X.beginPath();X.arc(ox,oy,3,0,7);X.fill();
  }
  bat((at*48)%(W+120)-60,74+Math.sin(at*2.2)*16,1.15,'#07020f');
  rc('#3b2a66',0,262,W,70);rc('#7a52b8',0,262,W,8);
  rc('rgba(0,0,0,.25)',0,270,W,2);
  for(let i=0;i<W;i+=32)rc('rgba(0,0,0,.25)',i,270,2,62);
}
function bgLv5Cut(){
  const g=X.createLinearGradient(0,0,0,262);g.addColorStop(0,'#2a0535');g.addColorStop(1,'#8a1c3c');
  X.fillStyle=g;X.fillRect(0,0,W,262);
  X.fillStyle='rgba(255,107,45,.25)';X.beginPath();X.arc(120,76,44,0,7);X.fill();
  X.fillStyle='#ff6b2d';X.beginPath();X.arc(120,76,30,0,7);X.fill();
  for(let i=0;i<5;i++){
    const px=60+i*165,thh=120+(i%2)*35;
    rc('#3a1245',px,262-thh,54,thh);
    for(let j=0;j<3;j++)rc('#3a1245',px+j*21,262-thh-14,11,14);
  }
  for(let i=0;i<22;i++){
    X.fillStyle=`rgba(255,${130+(i*5)%110},60,.85)`;
    rc(X.fillStyle,(i*61+Math.sin(at+i)*14)%W,262-((i*47+at*(28+(i%4)*10))%260),3,3);
  }
  bat((at*58+200)%(W+120)-60,86+Math.sin(at*2.5)*14,1.25,'#12001a');
  rc('#2b2b2b',0,262,W,70);rc('#777',0,262,W,8);
  for(let i=0;i<W;i+=32)rc('rgba(0,0,0,.3)',i,270,2,62);
  rc('#ff6b2d',0,327,W,5);
}
function bgLv6Cut(){
  const g=X.createLinearGradient(0,0,0,262);g.addColorStop(0,'#7fd4ff');g.addColorStop(1,'#e3ffd0');
  X.fillStyle=g;X.fillRect(0,0,W,262);
  X.fillStyle='rgba(255,224,102,.35)';X.beginPath();X.arc(680,66,42,0,7);X.fill();
  X.fillStyle='#ffe066';X.beginPath();X.arc(680,66,28,0,7);X.fill();
  X.fillStyle='#fff';
  for(let i=0;i<3;i++){
    const cx=((at*9+i*300)%960)-110,cy=42+i*28;
    rc('#fff',cx,cy,72,14);rc('#fff',cx+14,cy-10,42,12);
  }
  for(let i=0;i<5;i++){
    const hx=75+i*165,fc=['#ff5c8a','#ffd93b','#b06cff','#ff8a3d','#ff6fa5'][i];
    X.fillStyle='#3f9b3f';X.beginPath();X.arc(hx,262,56,Math.PI,0);X.fill();
    rc('#2e7d32',hx+42,190+(i%2)*12,4,72-(i%2)*12);
    X.fillStyle=fc;
    for(let a=0;a<6;a++){
      X.beginPath();
      X.arc(hx+44+Math.cos(a*1.047+at*.6)*10,186+(i%2)*12+Math.sin(a*1.047+at*.6)*10,8,0,7);
      X.fill();
    }
    X.fillStyle='#ffd93b';X.beginPath();X.arc(hx+44,186+(i%2)*12,6,0,7);X.fill();
    if(i%2==0){
      X.fillStyle='#fff';X.font='bold 22px monospace';X.textAlign='center';
      X.fillText(i==2?'7':'3',hx,244);
    }
  }
  for(let i=0;i<7;i++){
    const bx=((i*130+at*(22+i*4))%(W+80))-40,by=90+(i*37)%135+Math.sin(at*2.2+i)*20;
    const fl=Math.abs(Math.sin(at*12+i))*8+1;
    X.fillStyle=['#ff7ab8','#ffd93b','#7ad7ff','#b78cff'][i%4];
    rc(X.fillStyle,bx-fl-1,by-5,fl+1,9);rc(X.fillStyle,bx,by-5,fl+1,9);
    rc('#222',bx-1,by-4,2,9);
  }
  for(let i=0;i<14;i++){
    rc(i%2?'#ffb3d1':'#fff',(i*89+Math.sin(at+i)*18+at*12)%W,(i*53+at*(24+(i%3)*8))%262,4,3);
  }
  rc('#8b5a2b',0,262,W,70);rc('#5fc23a',0,262,W,8);
  rc('rgba(0,0,0,.2)',0,270,W,2);
  for(let i=0;i<W;i+=32)rc('rgba(0,0,0,.2)',i,270,2,62);
}
function drawBossDefeated(cx,by,ts){
  X.save();
  X.translate(Math.round(cx),Math.round(by));
  const jiggle=ts<.4?Math.sin(ts*45)*3:0;
  // Mahkota emas jatuh miring di sebelah kiri boss
  X.save();X.translate(-68,-10);X.rotate(-.45);
  rc('#000',-22,-10,44,12);
  rc('#ffd93b',-20,-8,8,8);rc('#ffd93b',-8,-8,8,8);rc('#ffd93b',4,-8,8,8);rc('#ffd93b',16,-8,6,8);
  X.restore();
  // Badan boss merah gepeng/terkapar & retak
  X.translate(jiggle,0);
  rc('#000',-47,-39,94,39);
  rc('#b81d2c',-44,-36,88,36);
  rc('#d62839',-44,-36,88,26);
  // Retakan pada tubuh boss
  X.strokeStyle='#1b1b1b';X.lineWidth=3;
  X.beginPath();X.moveTo(-26,-36);X.lineTo(-18,-22);X.lineTo(-28,-10);
  X.moveTo(28,-36);X.lineTo(20,-20);X.lineTo(30,-6);X.stroke();
  // Mata pusing (X)
  rc('#fff',-26,-28,14,12);rc('#fff',12,-28,14,12);
  X.strokeStyle='#000';X.lineWidth=2.5;
  X.beginPath();
  X.moveTo(-24,-26);X.lineTo(-14,-18);X.moveTo(-14,-26);X.lineTo(-24,-18);
  X.moveTo(14,-26);X.lineTo(24,-18);X.moveTo(24,-26);X.lineTo(14,-18);
  X.stroke();
  // Tulisan = ? = miring
  X.fillStyle='#ffd93b';X.font='bold 20px monospace';X.textAlign='center';
  X.fillText('= ? =',0,-5);
  X.restore();
  // Bintang pusing berputar & kepulan asap di atas boss
  for(let i=0;i<3;i++){
    const a=at*4.5+i*2.1;
    tx('*',Math.round(cx+Math.cos(a)*34),Math.round(by-54+Math.sin(a)*8),20,'#ffd93b');
  }
  for(let i=0;i<4;i++){
    const sy=((at*26+i*18)%46);
    const al=Math.max(0,.65-sy/46);
    rc(`rgba(210,210,210,${al})`,Math.round(cx-18+i*12+Math.sin(at*3+i)*5),Math.round(by-42-sy),9,9);
  }
}
function sKastil5(ts,p){
  bgLv5Cut();
  if(p==0){
    const u=Math.min(1,ts/.9),hx=Math.round(100+190*es(u)),walk=u<1;
    const look=walk?1:(((ts*1.5)|0)%2?1:-1);
    const rot=walk?0:(look>0?-.1:.08);
    hero(hx,262,4,walk?Math.sin(at*14):0,look,rot);
    if(!walk){
      bub(hx+28,112,'?!');
      rc('#ffd93b',hx+16,136-((at*22)%18),4,4);
    }
  }else{
    const look=((ts*1.8)|0)%2?1:-1;
    hero(290,262,4,0,look,Math.sin(at*4)*.05);
    tx('?!',290,104,38,'#ffd93b');
    rc('#4fc3f7',316,144+((at*30)%22),3,6);
  }
}
function sKalah5(ts){
  bgLv5Cut();
  drawBossDefeated(520,262,ts);
  const hop=Math.round(Math.abs(Math.sin(at*14))*15);
  const tilt=Math.sin(at*14)*.09;
  hero(275,262-hop,4,Math.sin(at*18),1,tilt);
  tx('HAHAHA!',275,102-Math.round(hop*.5),26,'#ffd93b');
  if(((at*4)|0)%2)bub(310,126,'WKWK');
}
function sTaman6(ts,p){
  if(p==0){
    bgLv5Cut();
    const u=Math.min(1,ts/1.6),hx=Math.round(250+130*u);
    hero(hx,262,4,Math.sin(at*12),1,0);
    tx('♪',hx+24,132-Math.round((at*24)%18),20,'#ffd93b');
  }else if(p==1){
    bgLv5Cut();
    const walkU=Math.min(1,ts/.55),hx=Math.round(380+50*es(walkU));
    const dimT=Math.max(0,ts-.55);
    if(dimT>0){
      const rad=Math.min(1000,es(Math.min(1,dimT/.65))*1000);
      X.save();X.beginPath();X.arc(hx,210,rad,0,7);X.clip();
      bgLv6Cut();
      X.restore();
      if(dimT<.75){
        X.strokeStyle='#5fc23a';X.lineWidth=6;X.beginPath();X.arc(hx,210,rad,0,7);X.stroke();
        X.strokeStyle='#ffd93b';X.lineWidth=3;X.beginPath();X.arc(hx,210,Math.max(0,rad-10),0,7);X.stroke();
      }
    }
    const jumpY=dimT>0&&dimT<.32?Math.round(Math.sin((dimT/.32)*Math.PI)*22):0;
    const look=dimT>.35?(((dimT*2.5)|0)%2?1:-1):1;
    hero(hx,262-jumpY,4,walkU<1?Math.sin(at*12):0,look,dimT>0&&dimT<.4?-.1:0);
    if(dimT>0){
      tx('!!',hx,104,42,'#ff5c8a');
      for(let i=0;i<10;i++){
        const a=i*.63+dimT*4.5,r=18+dimT*150;
        rc(i%2?'#ff7ab8':'#ffd93b',Math.round(hx+Math.cos(a)*r),Math.round(205+Math.sin(a)*r),6,6);
      }
    }
  }else{
    bgLv6Cut();
    const goU=Math.max(0,ts-.65),hx=Math.round(430+Math.min(1,goU/1.1)*90);
    const look=ts<.35?-1:1;
    hero(hx,262,4,goU>0?Math.sin(at*14):0,look,0);
    if(ts<.65)bub(hx+28,118,'...');
  }
}
function sTemu4(ts,p){
  bgLv4Cut(0);
  if(p==0){
    const walkU=Math.min(1,ts/.72),hx=Math.round(120+145*es(walkU));
    const shockT=Math.max(0,ts-.72);
    const jumpY=shockT>0&&shockT<.32?Math.round(Math.sin((shockT/.32)*Math.PI)*24):0;
    const rot=shockT>0?-.12*Math.max(0,1-shockT*1.2):0;
    hero(hx,262-jumpY,4,walkU<1?Math.sin(at*14):0,1,rot);
    if(shockT>0){
      const app=Math.min(1,shockT/.22),bob=Math.sin(at*6)*3;
      drawBossEq(520,262+bob,1.45*app,-1,app,shockT<.14);
      if(shockT<.45){
        for(let i=0;i<10;i++){
          const a=i*(Math.PI*2/10)+shockT*4,r=16+shockT*150;
          rc(i%2?'#ff5252':'#b78cff',Math.round(520+Math.cos(a)*r),Math.round(215+Math.sin(a)*r),7,7);
        }
      }
      tx('!!',hx,106,42,'#ff3b3b');
      rc('#4fc3f7',hx-26,142+((at*32)%22),3,6);
    }
  }else{
    const fade=Math.max(0,1-ts/.5);
    if(fade>0){
      drawBossEq(520+Math.sin(at*55)*4,262-ts*28,1.45*(.6+.4*fade),-1,fade,((at*20)|0)%2);
      for(let i=0;i<10;i++){
        const a=i*.63+ts*5,r=12+ts*130;
        rc(i%2?'#ff5252':'#7a52b8',Math.round(520+Math.cos(a)*r),Math.round(212+Math.sin(a)*r-ts*30),6,6);
      }
    }
    const look=ts<.55?1:(((ts*2.4)|0)%2?1:-1);
    hero(265,262,4,0,look,0);
    if(ts>.45)bub(296,118,'?!');
  }
}
function sDimensi(ts,p){
  if(p==0){
    bgLv4Cut(1);
    const walkU=Math.min(1,ts/.65),hx=Math.round(135+125*es(walkU));
    const appT=Math.max(0,ts-.65),dimT=Math.max(0,ts-.95);
    if(dimT>0){
      const rad=Math.min(1000,es(Math.min(1,dimT/.65))*1000);
      X.save();X.beginPath();X.arc(535,215,rad,0,7);X.clip();
      bgLv5Cut();
      X.restore();
      if(dimT<.75){
        X.strokeStyle='#ff5252';X.lineWidth=6;X.beginPath();X.arc(535,215,rad,0,7);X.stroke();
        X.strokeStyle='#ffd93b';X.lineWidth=3;X.beginPath();X.arc(535,215,Math.max(0,rad-10),0,7);X.stroke();
      }
    }
    const sh=appT>0?Math.sin(at*65)*3:0;
    const jumpY=appT>0&&appT<.3?Math.round(Math.sin((appT/.3)*Math.PI)*20):0;
    hero(hx+sh,262-jumpY,4,walkU<1?Math.sin(at*14):0,1,appT>0?-.1:0);
    if(appT>0){
      const app=Math.min(1,appT/.22),bob=Math.sin(at*7)*4;
      drawBossEq(535,262+bob,1.45*app,-1,app,dimT>0&&dimT<.2);
      tx('!!',hx,104,44,'#ffd93b');
      rc('#4fc3f7',hx-26,140+((at*34)%22),3,6);
    }
    if(dimT>0&&dimT<.35)rc(`rgba(255,40,60,${.45*(1-dimT/.35)})`,0,0,W,332);
  }else{
    bgLv5Cut();
    const fade=Math.max(0,1-Math.max(0,ts-.3)/.55);
    if(fade>0){
      const hop=ts<.3?Math.abs(Math.sin((ts/.3)*Math.PI))*18:0;
      drawBossEq(535,262-hop-(1-fade)*24,1.45,-1,fade,((at*18)|0)%2);
      if(ts>=.3){
        for(let i=0;i<10;i++){
          const a=i*.63+(ts-.3)*6,r=14+(ts-.3)*140;
          rc(i%2?'#ff6b2d':'#ffd93b',Math.round(535+Math.cos(a)*r),Math.round(212+Math.sin(a)*r),6,6);
        }
      }
    }
    hero(260,262,4,0,1,.08);
    rc('#ff5252',244,126,8,3);rc('#ff5252',246,124,3,8);
  }
}
function drawCut(){
  const s=cs.sc[cs.i],ts=at-cs.t0;
  X.save();X.beginPath();X.rect(0,0,W,332);X.clip();
  if(s.b=='ramai')cls(0,ts);else if(s.b=='sepi')cls(1,ts);else if(s.b=='guru')cls(2,ts);else if(s.b=='hutan')sHutan(ts);else if(s.b=='jatuh')sJatuh(ts);else if(s.b=='rimba')sRimba(ts,s.p);else if(s.b=='gunung')sGunung(ts,s.p);else if(s.b=='daki')sDaki(ts);else if(s.b=='sandung')sSandung(ts);else if(s.b=='lubang')sLubang(ts);else if(s.b=='malam')sMalam(ts,s.p);else if(s.b=='temu4')sTemu4(ts,s.p);else if(s.b=='dimensi')sDimensi(ts,s.p);else if(s.b=='kastil5')sKastil5(ts,s.p);else if(s.b=='kalah5')sKalah5(ts);else if(s.b=='taman6')sTaman6(ts,s.p);else sPortal(ts);
  rc(`rgba(0,0,0,${Math.max(0,1-ts*3.5)})`,0,0,W,332);
  X.restore();sub(s,ts);
  rc('#000',W-110,6,102,28);rc('#444',W-108,8,98,24);tx('SKIP ▶▶',W-59,27,13,'#fff');tx(`${cs.i+1}/${cs.sc.length}`,40,27,14,'#fff')
}
